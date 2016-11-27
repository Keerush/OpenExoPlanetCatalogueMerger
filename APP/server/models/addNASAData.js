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
	var zero = 2 - num.toString().length + 1;
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

function pushDiffs(updateInput) {
	var promise = new Promise(function(resolve, reject) {
		console.log('checking if open is different.');
		var diffQuery = 'SELECT a.name FROM ((SELECT * from NasaSystem WHERE name in ?) a JOIN (SELECT * from OpenSystem WHERE name in ?) b ON a.name = b.name AND (select * from NasaSystem where name = a.name) <> (select * from OpenSystem where name = b.name));',
			insertQuery = 'INSERT IGNORE INTO UnderReview (keyName, tableName) VALUES ?';
		var input = Array.from(new Set(updateInput));
		var diffs = [];

		Q.fcall(() => {
			var promise = pool.getConnection()
				.then(function(connection) {
					return connection.query(diffQuery, [
							[input],
							[input]
						])
						.then(function(rows) {
							diffs = rows.map((row) => {
								return [row.name, 'Nasa'];
							});
							pool.releaseConnection(connection);
						}).catch(function(err) {
							console.log(err);
							return (Q.reject(err));
						});
				});
			return promise;
		}).then(() => {
			console.log('test');
			var promise = pool.getConnection()
				.then(function(connection) {
					console.log(diffs);
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
					updateInput = [];

				console.log('Retrieved nasa data...');
				data.forEach(function(item) {
					systemInput.push([item.pl_hostname, formatDistance(item.dec_str, ['d', 'm', 's']), formatDistance(item.ra_str, ['h', 'm', 's']), item.st_dist, item.st_disterr1, item.st_disterr2, item.rowupdate]);
					planetInput.push([item.pl_hostname + ' ' + item.pl_letter, item.pl_orbsmax, item.pl_orbsmaxerr2, item.pl_orbsmaxerr1, item.pl_orbeccen, item.pl_orbeccenerr2, item.pl_orbeccenerr1, item.pl_orblper, item.pl_orblpererr2, item.pl_orblpererr1, item.pl_orbincl, item.pl_orbinclerr2, item.pl_orbinclerr1, item.pl_imppar, item.pl_impparerr2, item.pl_impparerr1, item.pl_orbper, item.pl_orbpererr2, item.pl_orbpererr1, item.pl_tranmid, item.pl_tranmiderr1, item.pl_tranmiderr2, item.pl_orbtper, item.pl_orbtpererr2, item.pl_orbtpererr1, item.pl_massj, item.pl_massjerr2, item.pl_massjerr1, item.pl_msinij, item.pl_msinijerr2, item.pl_msinijerr1, item.pl_radj, item.pl_radjerr2, item.pl_radjerr1, item.pl_eqt, item.pl_eqterr2, item.pl_eqterr1, item.pl_discmethod, item.pl_ttvflag, item.pl_disc, item.rowupdate]);
					starInput.push([item.pl_hostname, item.st_mass, item.st_masserr2, item.st_masserr1, item.st_rad, item.st_raderr2, item.st_raderr1, item.st_teff, item.st_tefferr2, item.st_tefferr1, item.st_age, item.st_ageerr1, item.st_ageerr2, item.st_metfe, item.st_metfeerr2, item.st_metfeerr1, item.st_spstr, item.st_bj, item.st_bjerr, item.st_bjerr, item.st_vj, item.st_vjerr, item.st_vjerr, item.st_rc, item.st_rcerr, item.st_rcerr, item.st_ic, item.st_icerr, item.st_icerr, item.st_j, item.st_jerr, item.st_jerr, item.st_h, item.st_herr, item.st_herr, item.st_k, item.st_kerr, item.st_kerr, item.rowupdate]);
					nameInput.push([item.pl_hostname, item.pl_hostname]);
					starSystemInput.push([item.pl_hostname, item.pl_hostname]);
					planetStarInput.push([item.pl_hostname + item.pl_letter, item.pl_hostname]);
					updateInput.push(item.pl_hostname);
				});

				console.log('Now parsing...');
				var systemQuery = 'REPLACE INTO NasaSystem (name, declination, rightascension, distance, distanceplus, distanceminus, lastupdate) VALUES ?',
					planetQuery = 'REPLACE INTO NasaPlanet (name, semimajoraxis, semimajoraxisminus, semimajoraxisplus, eccentricity, eccentricityminus, eccentricityplus, periastron, periastronplus, periastronminus, inclination, inclinationplus, inclinationminus, impactparameter, impactparameterplus, impactparameterminus, period, periodplus, periodminus, transittime, transittimeplus, transittimeminus, periastrontime, periastrontimeplus, periastrontimeminus, massjupiter, massjupiterplus, massjupiterminus, massmsini, massmsiniplus, massmsiniminus, radius, radiusplus, radiusminus, temperature, temperatureplus, temperatureminus, discoverymethod, istransiting, discoveryyear, lastupdate) VALUES ?',
					starQuery = 'REPLACE INTO NasaStar (name, mass, massplus, massminus, radius, radiusplus, radiusminus, temperature, temperatureplus, temperatureminus, age, ageplus, ageminus, metallicity, metallicityplus, metallicityminus, spectraltype, magB, magBplus, magBminus, magV, magVplus, magVminus, magR, magRplus, magRminus, magI, magIplus, magIminus, magJ, magJplus, magJminus, magH, magHplus, magHminus, magK, magKplus, magKminus, lastupdate) VALUES ?',
					nameQuery = 'REPLACE INTO NasaNames (name, otherName) VALUES ?',
					starSystemQuery = 'REPLACE INTO NasaStarSystem(starName, systemName) VALUES ?',
					planetStarQuery = 'REPLACE INTO NasaPlanetStar(planetName, starName) VALUES ?';

				var queries = [
						[systemQuery, systemInput],
						[planetQuery, planetInput],
						[starQuery, starInput],
						[nameQuery, nameInput],
						[starSystemQuery, starSystemInput],
						[planetStarQuery, planetStarInput]
					],
					promises = [];

				queries.forEach(function(item, index) {
					var promise = pool.getConnection()
						.then(function(connection) {
							return connection.query(item[0], [item[1]])
								.then(function(response) {
									pool.releaseConnection(connection);
								}).catch(function(err) {
									console.log(err);
									return (Q.reject(err));
								});
						});
					promises.push(promise);
				});

				// check for differences from the newly imported data.
				promises.push(pushDiffs(updateInput));

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