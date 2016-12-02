var config = require('../../config.js');
var Q = require('q');
var mysql = require('promise-mysql');

// Intialize pool.
function initializePool() {
	var pool = mysql.createPool({
		host: config.mysql.host,
		user: config.mysql.username,
		password: config.mysql.password,
		database: config.mysql.database
	});

	return pool;
}

/*
	- sendQuery will return:
	 	[{
			nasa: {...},
			open: {...}
		}, {...}]

	- nasa contains information found in nasa db
	- open contains information found in open db
*/

function sendQuery(query) {
	var pool = initializePool();
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
								eu = {},
								open = {};
							var isNasa = false,
								isEu = false;
							for (var key in row) {
								if (key.startsWith('n_')) {
									nasa[key] = row[key];
									isNasa = true;
								} else if (key.startsWith('e_')) {
									eu[key] = row[key];
									isEu = true;
								} else {
									open[key] = row[key];
								}
							}

							if (isNasa) {
								output.push({
									'nasa': nasa,
									'open': open
								});
							} else {
								output.push({
									'eu': eu,
									'open': open
								});
							}
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

function getLimitOffset(limit, offset) {
	var limitOffset = ';';
	if (typeof limit === 'string' && typeof offset === 'string') {
		limitOffset = ' LIMIT ' + limit + ' OFFSET ' + offset + ';';
	}
	return limitOffset;
}

// Get all items in needs review.
module.exports = {
	getNasaSystem: (limit, offset) => {
		var query = 'SELECT x.name as n_name, x.declination as n_declination, x.rightascension as n_rightascension, x.distance as n_distance, x.distanceminus as n_distanceminus, x.distanceplus as n_distanceplus, x.lastupdate as n_lastupdate, y.* FROM ((SELECT * FROM NasaSystem a JOIN UnderReview b ON a.name=b.keyName AND tablename="NasaSystem") x JOIN OpenSystem y ON x.name=y.name)' + getLimitOffset(limit, offset);
		return sendQuery(query);
	},
	getNasaPlanet: (limit, offset) => {
		var query = 'SELECT x.name as n_name, x.semimajoraxis as n_semimajoraxis, x.semimajoraxisminus as n_semimajoraxisminus, x.semimajoraxisplus as n_semimajoraxisplus, x.separationarcsec as n_separationarcsec, x.separationarcsecminus as n_separationarcsecminus, x.separationarcsecplus as n_separationarcsecplus, x.separationau as n_separationau, x.separationauminus as n_separationauminus, x.separationauplus as n_separationauplus, x.eccentricity as n_eccentricity, x.eccentricityminus as n_eccentricityminus, x.eccentricityplus as n_eccentricityplus, x.periastron as n_periastron, x.periastronminus as n_periastronminus, x.periastronplus as n_periastronplus, x.longitude as n_longitude, x.longitudeminus as n_longitudeminus, x.longitudeplus as n_longitudeplus, x.meananomaly as n_meananomaly, x.meananomalyminus as n_meananomalyminus, x.meananomalyplus as n_meananomalyplus, x.ascendingnode as n_ascendingnode, x.ascendingnodeminus as n_ascendingnodeminus, x.ascendingnodeplus as n_ascendingnodeplus, x.inclination as n_inclination, x.inclinationminus as n_inclinationminus, x.inclinationplus as n_inclinationplus, x.impactparameter as n_impactparameter, x.impactparameterminus as n_impactparameterminus, x.impactparameterplus as n_impactparameterplus, x.period as n_period, x.periodminus as n_periodminus, x.periodplus as n_periodplus, x.transittime as n_transittime, x.transittimeminus as n_transittimeminus, x.transittimeplus as n_transittimeplus, x.periastrontime as n_periastrontime, x.periastrontimeminus as n_periastrontimeminus, x.periastrontimeplus as n_periastrontimeplus, x.maximumrvtime as n_maximumrvtime, x.maximumrvtimeminus as n_maximumrvtimeminus, x.maximumrvtimeplus as n_maximumrvtimeplus, x.massjupiter as n_massjupiter, x.massjupiterminus as n_massjupiterminus, x.massjupiterplus as n_massjupiterplus, x.massmsini as n_massmsini, x.massmsiniminus as n_massmsiniminus, x.massmsiniplus as n_massmsiniplus, x.radius as n_radius, x.radiusminus as n_radiusminus, x.radiusplus as n_radiusplus, x.temperature as n_temperature, x.temperatureminus as n_temperatureminus, x.temperatureplus as n_temperatureplus, x.age as n_age, x.ageminus as n_ageminus, x.ageplus as n_ageplus, x.spectraltype as n_spectraltype, x.spectraltypeminus as n_spectraltypeminus, x.spectraltypeplus as n_spectraltypeplus, x.magB as n_magB, x.magBminus as n_magBminus, x.magBplus as n_magBplus, x.magV as n_magBplus, x.magVminus as n_magVminus, x.magVplus as n_magVplus, x.magR as n_magR, x.magRminus as n_magRminus, x.magRplus as n_magRplus, x.magI as n_magI, x.magIminus as n_magIminus, x.magIplus as n_magIplus, x.magJ as n_magJ, x.magJminus as n_magJminus, x.magJplus as n_magJplus, x.magH as n_magH, x.magHminus as n_magHminus, x.magHplus as n_magHplus, x.magK as n_magK, x.magKminus as n_magKminus, x.magKplus as n_magKplus, x.discoverymethod as n_discoverymethod, x.istransiting as n_istransiting, x.description as n_description, x.discoveryyear as n_discoveryyear, x.lastupdate as n_lastupdate, x.spinorbitalignment as n_spinorbitalignment, x.spinorbitalignmentminus as n_spinorbitalignmentminus, x.spinorbitalignmentplus as n_spinorbitalignmentplus, y.* FROM ((SELECT * FROM NasaPlanet a JOIN UnderReview b ON a.name=b.keyName AND tablename="NasaPlanet") x JOIN OpenPlanet y ON x.name=y.name)' + getLimitOffset(limit, offset);
		return sendQuery(query);
	},
	getNasaStar: (limit, offset) => {
		var query = 'SELECT x.name as n_name, x.mass as n_mass, x.massminus as n_massminus, x.massplus as n_massplus, x.radius as n_radius, x.radiusminus as n_radiusminus, x.radiusplus as n_radiusplus, x.temperature as n_temperature, x.temperatureminus as n_temperatureminus, x.temperatureplus as n_temperatureplus, x.age as n_age, x.ageminus as n_ageminus, x.ageplus as n_ageplus, x.metallicity as n_metallicity, x.metallicityminus as n_metallicityminus, x.metallicityplus as n_metallicityplus, x.spectraltype as n_spectraltype, x.magB as n_magB, x.magBminus as n_magBminus, x.magBplus as n_magBplus, x.magV as n_magV, x.magVminus as n_magVminus, x.magVplus as n_magVplus, x.magR as n_magR, x.magRminus as n_magRminus, x.magRplus as n_magRplus, x.magI as n_magI, x.magIminus as n_magIminus, x.magIplus as n_magIplus, x.magJ as n_magJ, x.magJminus as n_magJminus, x.magJplus as n_magJplus, x.magH as n_magH, x.magHminus as n_magHminus, x.magHplus as n_magHplus, x.magK as n_magK, x.magKminus as n_magKminus, x.magKplus as n_magKplus, x.lastupdate as n_lastupdate, y.* FROM ((SELECT * FROM NasaStar a JOIN UnderReview b ON a.name=b.keyName AND tablename="NasaStar") x JOIN OpenStar y ON x.name=y.name)' + getLimitOffset(limit, offset);
		return sendQuery(query);
	},
	getEuSystem: (limit, offset) => {
		var query = 'SELECT x.name as e_name, x.declination as e_declination, x.rightascension as e_rightascension, x.distance as e_distance, x.distanceminus as e_distanceminus, x.distanceplus as e_distanceplus, x.lastupdate as e_lastupdate, y.* FROM ((SELECT * FROM EuSystem a JOIN UnderReview b ON a.name=b.keyName AND tablename="EuSystem") x JOIN OpenSystem y ON x.name=y.name)' + getLimitOffset(limit, offset);
		return sendQuery(query);
	},
	getEuPlanet: (limit, offset) => {
		var query = 'SELECT x.name as e_name, x.semimajoraxis as e_semimajoraxis, x.semimajoraxisminus as e_semimajoraxisminus, x.semimajoraxisplus as e_semimajoraxisplus, x.separationarcsec as e_separationarcsec, x.separationarcsecminus as e_separationarcsecminus, x.separationarcsecplus as e_separationarcsecplus, x.separationau as e_separationau, x.separationauminus as e_separationauminus, x.separationauplus as e_separationauplus, x.eccentricity as e_eccentricity, x.eccentricityminus as e_eccentricityminus, x.eccentricityplus as e_eccentricityplus, x.periastron as e_periastron, x.periastronminus as e_periastronminus, x.periastronplus as e_periastronplus, x.longitude as e_longitude, x.longitudeminus as e_longitudeminus, x.longitudeplus as e_longitudeplus, x.meananomaly as e_meananomaly, x.meananomalyminus as e_meananomalyminus, x.meananomalyplus as e_meananomalyplus, x.ascendingnode as e_ascendingnode, x.ascendingnodeminus as e_ascendingnodeminus, x.ascendingnodeplus as e_ascendingnodeplus, x.inclination as e_inclination, x.inclinationminus as e_inclinationminus, x.inclinationplus as e_inclinationplus, x.impactparameter as e_impactparameter, x.impactparameterminus as e_impactparameterminus, x.impactparameterplus as e_impactparameterplus, x.period as e_period, x.periodminus as e_periodminus, x.periodplus as e_periodplus, x.transittime as e_transittime, x.transittimeminus as e_transittimeminus, x.transittimeplus as e_transittimeplus, x.periastrontime as e_periastrontime, x.periastrontimeminus as e_periastrontimeminus, x.periastrontimeplus as e_periastrontimeplus, x.maximumrvtime as e_maximumrvtime, x.maximumrvtimeminus as e_maximumrvtimeminus, x.maximumrvtimeplus as e_maximumrvtimeplus, x.massjupiter as e_massjupiter, x.massjupiterminus as e_massjupiterminus, x.massjupiterplus as e_massjupiterplus, x.massmsini as e_massmsini, x.massmsiniminus as e_massmsiniminus, x.massmsiniplus as e_massmsiniplus, x.radius as e_radius, x.radiusminus as e_radiusminus, x.radiusplus as e_radiusplus, x.temperature as e_temperature, x.temperatureminus as e_temperatureminus, x.temperatureplus as e_temperatureplus, x.age as e_age, x.ageminus as e_ageminus, x.ageplus as e_ageplus, x.spectraltype as e_spectraltype, x.spectraltypeminus as e_spectraltypeminus, x.spectraltypeplus as e_spectraltypeplus, x.magB as e_magB, x.magBminus as e_magBminus, x.magBplus as e_magBplus, x.magV as e_magBplus, x.magVminus as e_magVminus, x.magVplus as e_magVplus, x.magR as e_magR, x.magRminus as e_magRminus, x.magRplus as e_magRplus, x.magI as e_magI, x.magIminus as e_magIminus, x.magIplus as e_magIplus, x.magJ as e_magJ, x.magJminus as e_magJminus, x.magJplus as e_magJplus, x.magH as e_magH, x.magHminus as e_magHminus, x.magHplus as e_magHplus, x.magK as e_magK, x.magKminus as e_magKminus, x.magKplus as e_magKplus, x.discoverymethod as e_discoverymethod, x.istransiting as e_istransiting, x.description as e_description, x.discoveryyear as e_discoveryyear, x.lastupdate as e_lastupdate, x.spinorbitalignment as e_spinorbitalignment, x.spinorbitalignmentminus as e_spinorbitalignmentminus, x.spinorbitalignmentplus as e_spinorbitalignmentplus, y.* FROM ((SELECT * FROM EuPlanet a JOIN UnderReview b ON a.name=b.keyName AND tablename="EuPlanet") x JOIN OpenPlanet y ON x.name=y.name)' + getLimitOffset(limit, offset);
		return sendQuery(query);
	},
	getEuStar: (limit, offset) => {
		var query = 'SELECT x.name as e_name, x.mass as e_mass, x.massminus as e_massminus, x.massplus as e_massplus, x.radius as e_radius, x.radiusminus as e_radiusminus, x.radiusplus as e_radiusplus, x.temperature as e_temperature, x.temperatureminus as e_temperatureminus, x.temperatureplus as e_temperatureplus, x.age as e_age, x.ageminus as e_ageminus, x.ageplus as e_ageplus, x.metallicity as e_metallicity, x.metallicityminus as e_metallicityminus, x.metallicityplus as e_metallicityplus, x.spectraltype as e_spectraltype, x.magB as e_magB, x.magBminus as e_magBminus, x.magBplus as e_magBplus, x.magV as e_magV, x.magVminus as e_magVminus, x.magVplus as e_magVplus, x.magR as e_magR, x.magRminus as e_magRminus, x.magRplus as e_magRplus, x.magI as e_magI, x.magIminus as e_magIminus, x.magIplus as e_magIplus, x.magJ as e_magJ, x.magJminus as e_magJminus, x.magJplus as e_magJplus, x.magH as e_magH, x.magHminus as e_magHminus, x.magHplus as e_magHplus, x.magK as e_magK, x.magKminus as e_magKminus, x.magKplus as e_magKplus, x.lastupdate as e_lastupdate, y.* FROM ((SELECT * FROM EuStar a JOIN UnderReview b ON a.name=b.keyName AND tablename="EuStar") x JOIN OpenStar y ON x.name=y.name)' + getLimitOffset(limit, offset);
		return sendQuery(query);
	}
};