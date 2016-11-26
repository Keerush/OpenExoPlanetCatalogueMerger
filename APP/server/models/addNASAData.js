var config = require('../../config.js')
var mysql = require('promise-mysql');
var request = require('request');
var Q = require('q');
var fs = require('fs');

exports.addData = function() {
	var promise = new Promise(function(resolve, reject) {
		var pool = mysql.createPool({
			host: config.mysql.host,
			user: config.mysql.username,
			password: config.mysql.password,
			database: config.mysql.database
		});

		var url = config.nasa.url;

		console.log('Getting data from NASA');
		request({
			url: url,
			json: true
		}, function(err, response, data) {
			if (!err && response.statusCode === 200) {
				var systemInput = [],
					planetInput = [],
					starInput = [],
					nameInput = [],
					starSystemInput = [],
					planetStarInput = [];

				console.log('Retrieved nasa data, now parsing...');
				data.forEach(function(item) {
					systemInput.push([item.pl_hostname, item.dec_str, item.ra_str, item.st_dist, item.st_disterr1, item.st_disterr2]);
					planetInput.push([item.pl_hostname + ' ' + item.pl_letter, item.pl_orbsmax, item.pl_orbsmaxerr2, item.pl_orbsmaxerr1, item.pl_orbeccen, item.pl_orbeccenerr2, item.pl_orbeccenerr1, item.pl_orblper, item.pl_orblpererr2, item.pl_orblpererr1, item.pl_orbincl, item.pl_orbinclerr2, item.pl_orbinclerr1, item.pl_imppar, item.pl_impparerr2, item.pl_impparerr1, item.pl_orbper, item.pl_orbpererr2, item.pl_orbpererr1, item.pl_tranmid, item.pl_tranmiderr1, item.pl_tranmiderr2, item.pl_orbtper, item.pl_orbtpererr2, item.pl_orbtpererr1, item.pl_massj, item.pl_massjerr2, item.pl_massjerr1, item.pl_msinij, item.pl_msinijerr2, item.pl_msinijerr1, item.pl_radj, item.pl_radjerr2, item.pl_radjerr1, item.pl_eqt, item.pl_eqterr2, item.pl_eqterr1, item.pl_discmethod, item.pl_ttvflag, item.pl_disc, item.rowupdate]);
					starInput.push([item.pl_hostname, item.st_mass, item.st_masserr2, item.st_masserr1, item.st_rad, item.st_raderr2, item.st_raderr1, item.st_teff, item.st_tefferr2, item.st_tefferr1, item.st_age, item.st_ageerr1, item.st_ageerr2, item.st_metfe, item.st_metfeerr2, item.st_metfeerr1, item.st_spstr, item.st_bj, item.st_bjerr, item.st_bjerr, item.st_vj, item.st_vjerr, item.st_vjerr, item.st_rc, item.st_rcerr, item.st_rcerr, item.st_ic, item.st_icerr, item.st_icerr, item.st_j, item.st_jerr, item.st_jerr, item.st_h, item.st_herr, item.st_herr, item.st_k, item.st_kerr, item.st_kerr]);
					nameInput.push([item.pl_hostname, item.pl_hostname]);
					starSystemInput.push([item.pl_hostname, item.pl_hostname]);
					planetStarInput.push([item.pl_hostname + item.pl_letter, item.pl_hostname]);
				});

				console.log('Retrieved nasa data, now parsing...');
				var systemQuery = 'INSERT IGNORE INTO NasaSystem (name, declination, rightascension, distance, distanceplus, distanceminus) VALUES ?',
					planetQuery = 'INSERT IGNORE INTO NasaPlanet (name, semimajoraxis, semimajoraxisminus, semimajoraxisplus, eccentricity, eccentricityminus, eccentricityplus, periastron, periastronplus, periastronminus, inclination, inclinationplus, inclinationminus, impactparameter, impactparameterplus, impactparameterminus, period, periodplus, periodminus, transittime, transittimeplus, transittimeminus, periastrontime, periastrontimeplus, periastrontimeminus, massjupiter, massjupiterplus, massjupiterminus, massmsini, massmsiniplus, massmsiniminus, radius, radiusplus, radiusminus, temperature, temperatureplus, temperatureminus, discoverymethod, istransiting, discoveryyear, lastupdate) VALUES ?',
					starQuery = 'INSERT IGNORE INTO NasaStar (name, mass, massplus, massminus, radius, radiusplus, radiusminus, temperature, temperatureplus, temperatureminus, age, ageplus, ageminus, metallicity, metallicityplus, metallicityminus, spectraltype, magB, magBplus, magBminus, magV, magVplus, magVminus, magR, magRplus, magRminus, magI, magIplus, magIminus, magJ, magJplus, magJminus, magH, magHplus, magHminus, magK, magKplus, magKminus) VALUES ?',
					nameQuery = 'INSERT IGNORE INTO NasaNames (name, otherName) VALUES ?',
					starSystemQuery = 'INSERT IGNORE INTO NasaStarSystem(starName, systemName) VALUES ?',
					planetStarQuery = 'INSERT IGNORE INTO NasaPlanetStar(planetName, starName) VALUES ?';

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
								})
						});
					promises.push(promise);
				});

				Q.all(promises).then(function(data) {
					console.log('ending pool');
					pool.end();
					return resolve('Done!');
				}).catch(function(err) {
					console.log("error somewhere");
					pool.end();
					return resolve('Done with errors!');
				});
			}
		});
	});
	return promise;
};
