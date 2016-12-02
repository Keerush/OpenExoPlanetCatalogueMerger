var config = require('../../config.js')
var Converter = require("csvtojson").Converter;
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

function pushDiffs(updateInput, tableName) {
	var promise = new Promise(function(resolve, reject) {
		console.log('checking if open is different from Eu' + tableName + '.');
		var diffQuery = 'SELECT a.name FROM ((SELECT * from Eu' + tableName + ' WHERE name in ?) a JOIN (SELECT * from Open' + tableName + ' WHERE name in ?) b ON a.name = b.name AND (SELECT * from Eu' + tableName + ' where name = a.name) <> (SELECT * from Open' + tableName + ' where name = b.name));',
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
								return [row.name, 'Eu' + tableName];
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

module.exports = () => {
	var promise = new Promise(function(resolve, reject) {
		var url = config.exoplanet.url;
		var converter = new Converter({
			constructResult: false,
			workerNum: 4,
			ignoreEmpty: true
		});

		var systemInput = [],
			planetInput = [],
			starInput = [],
			nameInput = [],
			starSystemInput = [],
			planetStarInput = [],
			updateStarInput = {},
			updateSystemInput = {},
			updatePlanetInput = {};

		console.log('Getting data from exoplanet.eu');
		converter.on("record_parsed", function(item) {
			for (var currKey in item) {
				// inconsistent values found in eu
				if (item[currKey] == "" || item[currKey] == 'nan' || item[currKey] == 'inf') {
					delete item[currKey];
				}
			}
			// TODO: need to format item.dec and item.ra
			systemInput.push([item.star_name, item.dec, item.ra, item.star_distance, item.star_distance_error_max, item.star_distance_error_max, item.updated]);
			planetInput.push([item["# name"], item.semi_major_axis, item.semi_major_axis_error_min, item.semi_major_axis_error_max, item.eccentricity, item.eccentricity_error_min, item.eccentricity_error_max, item.omega, item.omega_error_max, item.omega_error_min, item.inclination, item.inclination_error_max, item.inclination_error_min, item.impact_parameter, item.impact_parameter_error_max, item.impact_parameter_error_min, item.tperi, item.tperi_error_max, item.tperi_error_min, null, null, null, item.tperi, item.tperi_error_max, item.tperi_error_min, null, null, null, item.mass_sini, item.mass_sini_error_max, item.mass_sini_error_min, item.radius, item.radius_error_max, item.radius_error_min, null, null, null, item.detection_type, null, item.discovered, item.updated]);
			starInput.push([item.star_name, item.star_mass, item.star_mass_error_max, item.star_mass_error_min, item.star_radius, item.star_mass_error_max, item.star_mass_error_min, item.star_teff, item.star_teff_error_max, item.star_teff_error_min, item.star_age, item.star_age_error_max, item.star_age_error_min, item.star_metallicity, item.star_metallicity_error_max, item.star_metallicity_error_min, item.star_sp_type, null, null, null, item.mag_v, null, null, null, null, null, item.mag_i, null, null, item.mag_j, null, null, item.mag_h, null, null, item.mag_k, null, null, item.updated]);
			if (!!item.alternate_names) {
				nameInput.push([item.star_name, item.alternate_names]);
			}
			starSystemInput.push([item.star_name, item.star_name]);
			planetStarInput.push([item["# name"], item.star_name]);

			updateSystemInput[item.star_name] = item.rowupdate;
			updateStarInput[item.star_name] = item.rowupdate;
			updatePlanetInput[item["# name"]] = item.rowupdate;
		});

		converter.on("end_parsed", function() {
			console.log('Retrieved eu data...');
			console.log('Now parsing...');

			var systemQuery = 'REPLACE INTO EuSystem (name, declination, rightascension, distance, distanceplus, distanceminus, lastupdate) VALUES ?',
				planetQuery = 'REPLACE INTO EuPlanet (name, semimajoraxis, semimajoraxisminus, semimajoraxisplus, eccentricity, eccentricityminus, eccentricityplus, periastron, periastronplus, periastronminus, inclination, inclinationplus, inclinationminus, impactparameter, impactparameterplus, impactparameterminus, period, periodplus, periodminus, transittime, transittimeplus, transittimeminus, periastrontime, periastrontimeplus, periastrontimeminus, massjupiter, massjupiterplus, massjupiterminus, massmsini, massmsiniplus, massmsiniminus, radius, radiusplus, radiusminus, temperature, temperatureplus, temperatureminus, discoverymethod, istransiting, discoveryyear, lastupdate) VALUES ?',
				starQuery = 'REPLACE INTO EuStar (name, mass, massplus, massminus, radius, radiusplus, radiusminus, temperature, temperatureplus, temperatureminus, age, ageplus, ageminus, metallicity, metallicityplus, metallicityminus, spectraltype, magB, magBplus, magBminus, magV, magVplus, magVminus, magR, magRplus, magRminus, magI, magIplus, magIminus, magJ, magJplus, magJminus, magH, magHplus, magHminus, magK, magKplus, magKminus, lastupdate) VALUES ?',
				nameQuery = 'REPLACE INTO EuNames (name, otherName) VALUES ?',
				starSystemQuery = 'REPLACE INTO EuStarSystem(starName, systemName) VALUES ?',
				planetStarQuery = 'REPLACE INTO EuPlanetStar(planetName, starName) VALUES ?',
				updateSystemQuery = 'SELECT name, lastupdate FROM EuSystem WHERE name IN ?',
				updateStarQuery = 'SELECT name, lastupdate FROM EuStar WHERE name IN ?',
				updatePlanetQuery = 'SELECT name, lastupdate FROM EuPlanet WHERE name IN ?';;

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
		});
		request.get(url).pipe(converter);
	});
	return promise;
};
