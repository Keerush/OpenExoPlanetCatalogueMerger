var config = require('../../config.js')
var Converter = require("csvtojson").Converter;
var mysql = require('promise-mysql');
var request = require('request');
var Q = require('q');
var fs = require('fs');

module.exports = () => {
	var promise = new Promise(function(resolve, reject) {
		var pool = mysql.createPool({
			host: config.mysql.host,
			user: config.mysql.username,
			password: config.mysql.password,
			database: config.mysql.database
		});

		var url = config.exoplanet.url;
		var converter = new Converter({constructResult:false, workerNum:4});

		var systemInput = [],
			planetInput = [],
			starInput = [],
			nameInput = [],
			starSystemInput = [],
			planetStarInput = [],
			updateInput = [];

		console.log('Getting data from exoplanet.eu');
		converter.on("record_parsed", function (item) {
			// TODO: need to format item.dec and item.ra
			systemInput.push([item.star_name, item.dec, item.ra, item.star_distance, item.star_distance_error_max, item.star_distance_error_max, item.updated]);
			planetInput.push([item["# name"], item.semi_major_axis, item.semi_major_axis_error_min, item.semi_major_axis_error_max, item.eccentricity, item.eccentricity_error_min, item.eccentricity_error_max, item.omega, item.omega_error_max, item.omega_error_min, item.inclination, item.inclination_error_max, item.inclination_error_min, item.impact_parameter, item.impact_parameter_error_max, item.impact_parameter_error_min, item.tperi, item.tperi_error_max, item.tperi_error_min, null, null, null, item.tperi, item.tperi_error_max, item.tperi_error_min, null, null, null, item.mass_sini, item.mass_sini_error_max, item.mass_sini_error_min, item.radius, item.radius_error_max, item.radius_error_min, null, null, null, item.detection_type, null, item.discovered, item.updated]);
			starInput.push([item.star_name, item.star_mass, item.star_mass_error_max, item.star_mass_error_min, item.star_radius, item.star_mass_error_max, item.star_mass_error_min, item.star_teff, item.star_teff_error_max, item.star_teff_error_min, item.star_age, item.star_age_error_max, item.star_age_error_min, item.star_metallicity, item.star_metallicity_error_max, item.star_metallicity_error_min, item.star_sp_type, null, null, null, item.mag_v, null, null, null, null, null, item.mag_i, null, null, item.mag_j, null, null, item.mag_h, null, null, item.mag_k, null, null]);
			nameInput.push([item.star_name, item.alternate_names]);
			starSystemInput.push([item.star_name, item.star_name]);
			planetStarInput.push([item["# name"], item.star_name]);
			updateInput.push(item["# name"]);
		});

		converter.on("end_parsed", function () {
			console.log('Retrieved eu data...');
			console.log('Now parsing...');

			var systemQuery = 'REPLACE INTO EuSystem (name, declination, rightascension, distance, distanceplus, distanceminus, lastupdate) VALUES ?',
				planetQuery = 'REPLACE INTO EuPlanet (name, semimajoraxis, semimajoraxisminus, semimajoraxisplus, eccentricity, eccentricityminus, eccentricityplus, periastron, periastronplus, periastronminus, inclination, inclinationplus, inclinationminus, impactparameter, impactparameterplus, impactparameterminus, period, periodplus, periodminus, transittime, transittimeplus, transittimeminus, periastrontime, periastrontimeplus, periastrontimeminus, massjupiter, massjupiterplus, massjupiterminus, massmsini, massmsiniplus, massmsiniminus, radius, radiusplus, radiusminus, temperature, temperatureplus, temperatureminus, discoverymethod, istransiting, discoveryyear, lastupdate) VALUES ?',
				starQuery = 'REPLACE INTO EuStar (name, mass, massplus, massminus, radius, radiusplus, radiusminus, temperature, temperatureplus, temperatureminus, age, ageplus, ageminus, metallicity, metallicityplus, metallicityminus, spectraltype, magB, magBplus, magBminus, magV, magVplus, magVminus, magR, magRplus, magRminus, magI, magIplus, magIminus, magJ, magJplus, magJminus, magH, magHplus, magHminus, magK, magKplus, magKminus, lastupdate) VALUES ?',
				nameQuery = 'REPLACE INTO EuNames (name, otherName) VALUES ?',
				starSystemQuery = 'REPLACE INTO EuStarSystem(starName, systemName) VALUES ?',
				planetStarQuery = 'REPLACE INTO EuPlanetStar(planetName, starName) VALUES ?';

			var queries = [
					[systemQuery, systemInput], // ERROR
					//[planetQuery, planetInput], // ERROR
					//[starQuery, starInput], // ERROR
					[nameQuery, nameInput], // WORKS
					[starSystemQuery, starSystemInput], // WORKS
					[planetStarQuery, planetStarInput] // WORKS
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
