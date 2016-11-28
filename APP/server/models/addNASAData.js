var config = require('../../config.js');
var mysql = require('promise-mysql');
var request = require('request');
var Q = require('q');
var fs = require('fs');

var pool = mysql.createPool({
	host: config.mysql.host,
	user: config.mysql.username,
	password: config.mysql.password,
	database: config.mysql.database
});

function pad(num, places) {
	var zero = places - num.toString().length + 1;
	return Array(+(zero > 0 && zero)).join("0") + num;
}

function formatDistance(str, vals) {
	var parsed = str,
		output = '';

	vals.forEach((chr) => {
		parsed = parsed.replace(chr, ' ');
	});

	parsed.trim().split(' ').forEach((num) => {
		output += pad(num, 2) + ' ';
	});

	return output.trim();
}

function pushDiffs(updateInput, tableName) {
	var promise = new Promise(function(resolve, reject) {
		console.log('checking if open is different from Nasa' + tableName + '.');
		var diffQuery = 'SELECT a.name FROM ((SELECT * from Nasa' + tableName + ' WHERE name in ?) a JOIN (SELECT * from Open' + tableName + ' WHERE name in ?) b ON a.name = b.name AND (SELECT * from Nasa' + tableName + ' where name = a.name) <> (SELECT * from Open' + tableName + ' where name = b.name));',
			insertQuery = 'INSERT IGNORE INTO UnderReview (keyName, tableName) VALUES ?';
		var input = Array.from(new Set(updateInput));
		let diffs = [];

		Q.fcall(() => {
			var promise = pool.getConnection()
				.then(function(connection) {
					return connection.query(diffQuery, [
							[input],
							[input]
						])
						.then(function(rows) {
							diffs = rows.map((row) => {
								return [row.name, 'Nasa' + tableName];
							});
							pool.releaseConnection(connection);
						}).catch(function(err) {
							console.log(err);
							return (Q.reject(err));
						});
				});
			return promise;
		}).then(() => {
			var promise = pool.getConnection()
				.then(function(connection) {
					return connection.query(insertQuery, [diffs])
						.then(function() {
							pool.releaseConnection(connection);
						}).catch(function(err) {
							console.log(err);
							return (Q.reject(err));
						});
				});
			return promise;
		}).then(() => {
			resolve('DONE');
		}).done();
	});
	return promise;
}

function runQueries(queries) {
	var promise = new Promise(function(resolve, reject) {
		var promises = [];
		queries.forEach(function(item, index) {
			var promiseQ = pool.getConnection()
				.then(function(connection) {
					return connection.query(item[0], [item[1]])
						.then(function(response) {
							pool.releaseConnection(connection);
						}).catch(function(err) {
							console.log(err);
							return (Q.reject(err));
						});
				});
			promises.push(promiseQ);
		});

		Q.all(promises).then(function(data) {
			return resolve('Done!');
		}).catch(function(err) {
			console.log(err);
			console.log("error somewhere");
			return resolve('Done with errors!');
		});

	});

	return promise;
}

function runUpdates(updateSystemInput, updateStarInput, updatePlanetInput) {
	var promise = new Promise(function(resolve, reject) {
		var promises = [],
		systemKeys = Object.getOwnPropertyNames(updateSystemInput),
		starKeys = Object.getOwnPropertyNames(updateStarInput),
		planetKeys = Object.getOwnPropertyNames(updatePlanetInput);

		if (systemKeys.length != 0) {
			promises.push(pushDiffs(systemKeys, 'System'));
		}
		if (starKeys.length != 0) {
			promises.push(pushDiffs(starKeys, 'Star'));
		}
		if (planetKeys.length != 0) {
			promises.push(pushDiffs(planetKeys, 'Planet'));
		}

		Q.all(promises).then(function(data) {
			return resolve('Done!');
		}).catch(function(err) {
			console.log(err);
			console.log("error somewhere");
			return resolve('Done with errors!');
		});
	});

	return promise;
}

function checkUpdates(updatesInfo) {
	var promise = new Promise(function(resolve, reject) {
		var promises = [];
		updatesInfo.forEach((item) => {
			var promiseU = pool.getConnection()
				.then(function(connection) {
					console.log('Checking for new updates.');
					return connection.query(item[1], [
							[item[2].map(x => x[0])]
						])
						.then(function(rows) {
							rows.forEach((row) => {
								if (row.name in item[0] && item[0][row.name] == row.lastupdate) {
									delete item[0][row.name];
								}
							});

							pool.releaseConnection(connection);
						}).catch(function(err) {
							console.log(err);
							return (Q.reject(err));
						});
				});
			promises.push(promiseU);
		});

		Q.all(promises).then(function(data) {
			return resolve(updatesInfo.map(x => x[0]));
		}).catch(function(err) {
			console.log(err);
			console.log("error somewhere");
			return resolve('Done with errors!');
		});
	});

	return promise
}

module.exports = () => {
	var promise = new Promise(function(resolve, reject) {
		console.log('Getting data from NASA');
		request({
			url: config.nasa.url,
			json: true
		}, function(err, response, data) {
			if (!err && response.statusCode === 200) {
				var systemInput = [],
					planetInput = [],
					starInput = [],
					nameInput = [],
					starSystemInput = [],
					planetStarInput = [],
					updateStarInput = {},
					updateSystemInput = {},
					updatePlanetInput = {};

				console.log('Retrieved nasa data...');
				data.forEach(function(item) {
					systemInput.push([item.pl_hostname, formatDistance(item.dec_str, ['d', 'm', 's']), formatDistance(item.ra_str, ['h', 'm', 's']), item.st_dist, item.st_disterr1, item.st_disterr2, item.rowupdate]);
					planetInput.push([item.pl_hostname + ' ' + item.pl_letter, item.pl_orbsmax, item.pl_orbsmaxerr2, item.pl_orbsmaxerr1, item.pl_orbeccen, item.pl_orbeccenerr2, item.pl_orbeccenerr1, item.pl_orblper, item.pl_orblpererr2, item.pl_orblpererr1, item.pl_orbincl, item.pl_orbinclerr2, item.pl_orbinclerr1, item.pl_imppar, item.pl_impparerr2, item.pl_impparerr1, item.pl_orbper, item.pl_orbpererr2, item.pl_orbpererr1, item.pl_tranmid, item.pl_tranmiderr1, item.pl_tranmiderr2, item.pl_orbtper, item.pl_orbtpererr2, item.pl_orbtpererr1, item.pl_massj, item.pl_massjerr2, item.pl_massjerr1, item.pl_msinij, item.pl_msinijerr2, item.pl_msinijerr1, item.pl_radj, item.pl_radjerr2, item.pl_radjerr1, item.pl_eqt, item.pl_eqterr2, item.pl_eqterr1, item.pl_discmethod, item.pl_ttvflag, item.pl_disc, item.rowupdate]);
					starInput.push([item.pl_hostname, item.st_mass, item.st_masserr2, item.st_masserr1, item.st_rad, item.st_raderr2, item.st_raderr1, item.st_teff, item.st_tefferr2, item.st_tefferr1, item.st_age, item.st_ageerr1, item.st_ageerr2, item.st_metfe, item.st_metfeerr2, item.st_metfeerr1, item.st_spstr, item.st_bj, item.st_bjerr, item.st_bjerr, item.st_vj, item.st_vjerr, item.st_vjerr, item.st_rc, item.st_rcerr, item.st_rcerr, item.st_ic, item.st_icerr, item.st_icerr, item.st_j, item.st_jerr, item.st_jerr, item.st_h, item.st_herr, item.st_herr, item.st_k, item.st_kerr, item.st_kerr, item.rowupdate]);
					nameInput.push([item.pl_hostname, item.pl_hostname]);
					starSystemInput.push([item.pl_hostname, item.pl_hostname]);
					planetStarInput.push([item.pl_hostname + ' ' + item.pl_letter, item.pl_hostname]);

					updateSystemInput[item.pl_hostname] = item.rowupdate;
					updateStarInput[item.pl_hostname] = item.rowupdate;
					updatePlanetInput[item.pl_hostname + ' ' + item.pl_letter] = item.rowupdate;
				});

				console.log('Now parsing...');
				var systemQuery = 'REPLACE INTO NasaSystem (name, declination, rightascension, distance, distanceplus, distanceminus, lastupdate) VALUES ?',
					planetQuery = 'REPLACE INTO NasaPlanet (name, semimajoraxis, semimajoraxisminus, semimajoraxisplus, eccentricity, eccentricityminus, eccentricityplus, periastron, periastronplus, periastronminus, inclination, inclinationplus, inclinationminus, impactparameter, impactparameterplus, impactparameterminus, period, periodplus, periodminus, transittime, transittimeplus, transittimeminus, periastrontime, periastrontimeplus, periastrontimeminus, massjupiter, massjupiterplus, massjupiterminus, massmsini, massmsiniplus, massmsiniminus, radius, radiusplus, radiusminus, temperature, temperatureplus, temperatureminus, discoverymethod, istransiting, discoveryyear, lastupdate) VALUES ?',
					starQuery = 'REPLACE INTO NasaStar (name, mass, massplus, massminus, radius, radiusplus, radiusminus, temperature, temperatureplus, temperatureminus, age, ageplus, ageminus, metallicity, metallicityplus, metallicityminus, spectraltype, magB, magBplus, magBminus, magV, magVplus, magVminus, magR, magRplus, magRminus, magI, magIplus, magIminus, magJ, magJplus, magJminus, magH, magHplus, magHminus, magK, magKplus, magKminus, lastupdate) VALUES ?',
					nameQuery = 'REPLACE INTO NasaNames (name, otherName) VALUES ?',
					starSystemQuery = 'REPLACE INTO NasaStarSystem(starName, systemName) VALUES ?',
					planetStarQuery = 'REPLACE INTO NasaPlanetStar(planetName, starName) VALUES ?',
					updateSystemQuery = 'SELECT name, lastupdate FROM NasaSystem WHERE name IN ?',
					updateStarQuery = 'SELECT name, lastupdate FROM NasaStar WHERE name IN ?',
					updatePlanetQuery = 'SELECT name, lastupdate FROM NasaPlanet WHERE name IN ?';

				var queries = [
						[systemQuery, systemInput],
						[planetQuery, planetInput],
						[starQuery, starInput],
						[nameQuery, nameInput],
						[starSystemQuery, starSystemInput],
						[planetStarQuery, planetStarInput]
					],
					promises = [];

				// check last row update.
				var updatesInfo = [
					[updateSystemInput, updateSystemQuery, systemInput],
					[updateStarInput, updateStarQuery, starInput],
					[updatePlanetInput, updatePlanetQuery, planetInput]
				];
				var promise = checkUpdates(updatesInfo)
					.then((res) => {
						return runQueries(queries).then(() => {
							// check for differences from the newly imported data.
							return runUpdates(res[0], res[1], res[2]);
						});
					});
				promises.push(promise);

				Q.all(promises).then(function(data) {
					console.log('ending pool');
					pool.end();
					return resolve('Done!');
				}).catch(function(err) {
					console.log(err);
					console.log("error somewhere");
					pool.end();
					return resolve('Done with errors!');
				});
			}
		});
	});
	return promise;
};