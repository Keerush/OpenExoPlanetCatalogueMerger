var config = require('../../config.js');
var Q = require('q');
var mysql = require('promise-mysql');

// Intialize pool.
var pool = mysql.createPool({
	host: config.mysql.host,
	user: config.mysql.username,
	password: config.mysql.password,
	database: config.mysql.database
});

/*
	- sendQueryNasa will return:
	 	[{
			nasa: {...},
			open: {...}
		}, {...}]

	- nasa contains information found in nasa db
	- open contains information found in open db
*/

function sendQueryNasa(query) {
	var promise = new Promise(function(resolve, reject) {

		var promises = [];
		var systemDiffs = [];
		var output = [];

		// Get information from nasa.
		var promise = pool.getConnection()
			.then((conn) => {
				return conn.query(query)
					.then((rows) => {
						// Return data pairs of nasa/eu and open.
						rows.forEach((row) => {
							var nasa = {},
								open = {};
							for (var key in row) {
								if (key.startsWith('n_')) {
									nasa[key] = row[key];
								} else {
									open[key] = row[key];
								}
							}

							output.push({
								'nasa': nasa,
								'open': open
							});
						});
						pool.releaseConnection(conn);
					});
			});
		promises.push(promise);

		// Wait for all promises to be reviewed.
		Q.all(promises).then(function(data) {
			console.log('ending pool');
			resolve(output);
			pool.end();
		}).catch(function(err) {
			console.log("error somewhere : ", err);
			resolve(output);
			pool.end();
		});
	});
	return promise;
}

// Get all items in needs review.
module.exports = {
	getNasaSystem: () => {
		var query = 'SELECT x.name as n_name, x.declination as n_declination, x.rightascension as n_rightascension, x.distance as n_distance, x.distanceminus as n_distanceminus, x.distanceplus as n_distanceplus, x.lastupdate as n_lastupdate, y.* FROM ((SELECT * FROM NasaSystem a JOIN UnderReview b ON a.name=b.keyName AND tablename="NasaSystem") x JOIN OpenSystem y ON x.name=y.name);';
		return sendQueryNasa(query);
	},
	getNasaPlanet: () => {
		var query = 'SELECT x.name as n_name, x.semimajoraxis as n_semimajoraxis, x.semimajoraxisminus as n_semimajoraxisminus, x.semimajoraxisplus as n_semimajoraxisplus, x.separationarcsec as n_separationarcsec, x.separationarcsecminus as n_separationarcsecminus, x.separationarcsecplus as n_separationarcsecplus, x.separationau as n_separationau, x.separationauminus as n_separationauminus, x.separationauplus as n_separationauplus, x.eccentricity as n_eccentricity, x.eccentricityminus as n_eccentricityminus, x.eccentricityplus as n_eccentricityplus, x.periastron as n_periastron, x.periastronminus as n_periastronminus, x.periastronplus as n_periastronplus, x.longitude as n_longitude, x.longitudeminus as n_longitudeminus, x.longitudeplus as n_longitudeplus, x.meananomaly as n_meananomaly, x.meananomalyminus as n_meananomalyminus, x.meananomalyplus as n_meananomalyplus, x.ascendingnode as n_ascendingnode, x.ascendingnodeminus as n_ascendingnodeminus, x.ascendingnodeplus as n_ascendingnodeplus, x.inclination as n_inclination, x.inclinationminus as n_inclinationminus, x.inclinationplus as n_inclinationplus, x.impactparameter as n_impactparameter, x.impactparameterminus as n_impactparameterminus, x.impactparameterplus as n_impactparameterplus, x.period as n_period, x.periodminus as n_periodminus, x.periodplus as n_periodplus, x.transittime as n_transittime, x.transittimeminus as n_transittimeminus, x.transittimeplus as n_transittimeplus, x.periastrontime as n_periastrontime, x.periastrontimeminus as n_periastrontimeminus, x.periastrontimeplus as n_periastrontimeplus, x.maximumrvtime as n_maximumrvtime, x.maximumrvtimeminus as n_maximumrvtimeminus, x.maximumrvtimeplus as n_maximumrvtimeplus, x.massjupiter as n_massjupiter, x.massjupiterminus as n_massjupiterminus, x.massjupiterplus as n_massjupiterplus, x.massmsini as n_massmsini, x.massmsiniminus as n_massmsiniminus, x.massmsiniplus as n_massmsiniplus, x.radius as n_radius, x.radiusminus as n_radiusminus, x.radiusplus as n_radiusplus, x.temperature as n_temperature, x.temperatureminus as n_temperatureminus, x.temperatureplus as n_temperatureplus, x.age as n_age, x.ageminus as n_ageminus, x.ageplus as n_ageplus, x.spectraltype as n_spectraltype, x.spectraltypeminus as n_spectraltypeminus, x.spectraltypeplus as n_spectraltypeplus, x.magB as n_magB, x.magBminus as n_magBminus, x.magBplus as n_magBplus, x.magV as n_magBplus, x.magVminus as n_magVminus, x.magVplus as n_magVplus, x.magR as n_magR, x.magRminus as n_magRminus, x.magRplus as n_magRplus, x.magI as n_magI, x.magIminus as n_magIminus, x.magIplus as n_magIplus, x.magJ as n_magJ, x.magJminus as n_magJminus, x.magJplus as n_magJplus, x.magH as n_magH, x.magHminus as n_magHminus, x.magHplus as n_magHplus, x.magK as n_magK, x.magKminus as n_magKminus, x.magKplus as n_magKplus, x.discoverymethod as n_discoverymethod, x.istransiting as n_istransiting, x.description as n_description, x.discoveryyear as n_discoveryyear, x.lastupdate as n_lastupdate, x.spinorbitalignment as n_spinorbitalignment, x.spinorbitalignmentminus as n_spinorbitalignmentminus, x.spinorbitalignmentplus as n_spinorbitalignmentplus, y.* FROM ((SELECT * FROM NasaPlanet a JOIN UnderReview b ON a.name=b.keyName AND tablename="NasaPlanet") x JOIN OpenPlanet y ON x.name=y.name);';
		return sendQueryNasa(query);
	},
	getNasaStar: () => {
		var query = 'SELECT x.name as n_name, x.mass as n_mass, x.massminus as n_massminus, x.massplus as n_massplus, x.radius as n_radius, x.radiusminus as n_radiusminus, x.radiusplus as n_radiusplus, x.temperature as n_temperature, x.temperatureminus as n_temperatureminus, x.temperatureplus as n_temperatureplus, x.age as n_age, x.ageminus as n_ageminus, x.ageplus as n_ageplus, x.metallicity as n_metallicity, x.metallicityminus as n_metallicityminus, x.metallicityplus as n_metallicityplus, x.spectraltype as n_spectraltype, x.magB as n_magB, x.magBminus as n_magBminus, x.magBplus as n_magBplus, x.magV as n_magV, x.magVminus as n_magVminus, x.magVplus as n_magVplus, x.magR as n_magR, x.magRminus as n_magRminus, x.magRplus as n_magRplus, x.magI as n_magI, x.magIminus as n_magIminus, x.magIplus as n_magIplus, x.magJ as n_magJ, x.magJminus as n_magJminus, x.magJplus as n_magJplus, x.magH as n_magH, x.magHminus as n_magHminus, x.magHplus as n_magHplus, x.magK as n_magK, x.magKminus as n_magKminus, x.magKplus as n_magKplus, x.lastupdate as n_lastupdate, y.* FROM ((SELECT * FROM NasaStar a JOIN UnderReview b ON a.name=b.keyName AND tablename="NasaStar") x JOIN OpenStar y ON x.name=y.name);';
		return sendQueryNasa(query);

	}
};