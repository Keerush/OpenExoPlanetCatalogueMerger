var config = require('../../config.js')
var mysql = require('promise-mysql');
var Q = require('q');

var pool = mysql.createPool({
	host: config.mysql.host,
	user: config.mysql.username,
	password: config.mysql.password,
	database: config.mysql.database
});

module.exports = () => {
	var promise = new Promise(function(resolve, reject) {
		// Create tables.
		var tNames = 'Names(' +
			'name VARCHAR(255) PRIMARY KEY NOT NULL,' +
			'otherName VARCHAR(255) NOT NULL' +
			')' ;

		var tSystem = 'System(' +
			'name VARCHAR(255) PRIMARY KEY NOT NULL,' +
			'declination VARCHAR(255),' +
			'rightascension VARCHAR(255),' +
			'distance DOUBLE,' +
			'distanceminus DOUBLE,' +
			'distanceplus DOUBLE,' +
			'videolink VARCHAR(255),' +
			'lastupdate	VARCHAR(255),' +
			'fileName VARCHAR(255)' +
			')';

		var tStarSystem = 'StarSystem(' +
			'starName VARCHAR(255) NOT NULL PRIMARY KEY,' +
			'systemName VARCHAR(255) NOT NULL' +
			')';

		var tPlanet = 'Planet(' +
			'name VARCHAR(255) PRIMARY KEY NOT NULL,' +
			'semimajoraxis DOUBLE,' +
			'semimajoraxisminus DOUBLE,' +
			'semimajoraxisplus DOUBLE,' +
			'separationarcsec DOUBLE,' +
			'separationarcsecminus DOUBLE,' +
			'separationarcsecplus DOUBLE,' +
			'separationau DOUBLE,' +
			'separationauminus DOUBLE,' +
			'separationauplus DOUBLE,' +
			'eccentricity DOUBLE,' +
			'eccentricityminus DOUBLE,' +
			'eccentricityplus DOUBLE,' +
			'periastron DOUBLE,' +
			'periastronminus DOUBLE,' +
			'periastronplus DOUBLE,' +
			'longitude DOUBLE,' +
			'longitudeminus DOUBLE,' +
			'longitudeplus DOUBLE,' +
			'meananomaly DOUBLE,' +
			'meananomalyminus DOUBLE,' +
			'meananomalyplus DOUBLE,' +
			'ascendingnode DOUBLE,' +
			'ascendingnodeminus DOUBLE,' +
			'ascendingnodeplus DOUBLE,' +
			'inclination DOUBLE,' +
			'inclinationminus DOUBLE,' +
			'inclinationplus DOUBLE,' +
			'impactparameter DOUBLE,' +
			'impactparameterminus DOUBLE,' +
			'impactparameterplus DOUBLE,' +
			'period DOUBLE,' +
			'periodminus DOUBLE,' +
			'periodplus DOUBLE,' +
			'transittime DOUBLE,' +
			'transittimeminus DOUBLE,' +
			'transittimeplus DOUBLE,' +
			'periastrontime DOUBLE,' +
			'periastrontimeminus DOUBLE,' +
			'periastrontimeplus DOUBLE,' +
			'maximumrvtime DOUBLE,' +
			'maximumrvtimeminus DOUBLE,' +
			'maximumrvtimeplus DOUBLE,' +
			'massjupiter DOUBLE,' +
			'massjupiterminus DOUBLE,' +
			'massjupiterplus DOUBLE,' +
			'massmsini DOUBLE,' +
			'massmsiniminus DOUBLE,' +
			'massmsiniplus DOUBLE,' +
			'radius DOUBLE,' +
			'radiusminus DOUBLE,' +
			'radiusplus DOUBLE,' +
			'temperature DOUBLE,' +
			'temperatureminus DOUBLE,' +
			'temperatureplus DOUBLE,' +
			'age DOUBLE,' +
			'ageminus DOUBLE,' +
			'ageplus DOUBLE,' +
			'spectraltype VARCHAR(255),' +
			'spectraltypeminus VARCHAR(255),' +
			'spectraltypeplus VARCHAR(255),' +
			'magB DOUBLE,' +
			'magBminus DOUBLE,' +
			'magBplus DOUBLE,' +
			'magV DOUBLE,' +
			'magVminus DOUBLE,' +
			'magVplus DOUBLE,' +
			'magR DOUBLE,' +
			'magRminus DOUBLE,' +
			'magRplus DOUBLE,' +
			'magI DOUBLE,' +
			'magIminus DOUBLE,' +
			'magIplus DOUBLE,' +
			'magJ DOUBLE,' +
			'magJminus DOUBLE,' +
			'magJplus DOUBLE,' +
			'magH DOUBLE,' +
			'magHminus DOUBLE,' +
			'magHplus DOUBLE,' +
			'magK DOUBLE,' +
			'magKminus DOUBLE,' +
			'magKplus DOUBLE,' +
			'discoverymethod VARCHAR(255),' +
			'istransiting INT,' +
			'description VARCHAR(255),' +
			'discoveryyear INT,' +
			'lastupdate	VARCHAR(255),' +
			'spinorbitalignment DOUBLE,' +
			'spinorbitalignmentminus DOUBLE,' +
			'spinorbitalignmentplus DOUBLE,' +
			'fileName VARCHAR(255)' +
			')';

		var tStar = 'Star(' +
			'name VARCHAR(255) PRIMARY KEY NOT NULL,' +
			'mass DOUBLE,' +
			'massminus DOUBLE,' +
			'massplus DOUBLE,' +
			'radius DOUBLE,' +
			'radiusminus DOUBLE,' +
			'radiusplus DOUBLE,' +
			'temperature DOUBLE,' +
			'temperatureminus DOUBLE,' +
			'temperatureplus DOUBLE,' +
			'age DOUBLE,' +
			'ageminus DOUBLE,' +
			'ageplus DOUBLE,' +
			'metallicity DOUBLE,' +
			'metallicityminus DOUBLE,' +
			'metallicityplus DOUBLE,' +
			'spectraltype VARCHAR(255),' +
			'magB DOUBLE,' +
			'magBminus DOUBLE,' +
			'magBplus DOUBLE,' +
			'magV DOUBLE,' +
			'magVminus DOUBLE,' +
			'magVplus DOUBLE,' +
			'magR DOUBLE,' +
			'magRminus DOUBLE,' +
			'magRplus DOUBLE,' +
			'magI DOUBLE,' +
			'magIminus DOUBLE,' +
			'magIplus DOUBLE,' +
			'magJ DOUBLE,' +
			'magJminus DOUBLE,' +
			'magJplus DOUBLE,' +
			'magH DOUBLE,' +
			'magHminus DOUBLE,' +
			'magHplus DOUBLE,' +
			'magK DOUBLE,' +
			'magKminus DOUBLE,' +
			'magKplus DOUBLE,' +
			'lastupdate	VARCHAR(255),' +
			'fileName VARCHAR(255)' +
			')';

		var tPlanetStar = 'PlanetStar(' +
			'planetName VARCHAR(255) NOT NULL PRIMARY KEY,' +
			'starName VARCHAR(255) NOT NULL' +
			')';

		var tBinary = 'Binary(' +
			'name VARCHAR(255) PRIMARY KEY NOT NULL,' +
			'semimajoraxis DOUBLE,' +
			'separation DOUBLE,' +
			'positionangle DOUBLE,' +
			'eccentricity DOUBLE,' +
			'periastron DOUBLE,' +
			'longitude DOUBLE,' +
			'meananomaly DOUBLE,' +
			'ascendingnode DOUBLE,' +
			'inclination DOUBLE,' +
			'period DOUBLE,' +
			'transittime DOUBLE,' +
			'periastrontime DOUBLE,' +
			'maximumrvtime DOUBLE,' +
			'magB VARCHAR(255),' +
			'magV VARCHAR(255),' +
			'magR VARCHAR(255),' +
			'magI VARCHAR(255),' +
			'magJ VARCHAR(255),' +
			'magH VARCHAR(255),' +
			'magK VARCHAR(255),' +
			'lastupdate	VARCHAR(255),' +
			'fileName VARCHAR(255)' +
			')';

		var tBinaryBinary = 'BinaryBinary(' +
			'binaryName VARCHAR(255) NOT NULL PRIMARY KEY,' +
			'otherBinaryName VARCHAR(255) NOT NULL' +
			')';

		var tStarBinary = 'StarBinary(' +
			'starName VARCHAR(255) NOT NULL PRIMARY KEY,' +
			'binaryName VARCHAR(255) NOT NULL' +
			')';

		var tUnderReview = 'UnderReview(' +
			'keyName VARCHAR(255) NOT NULL,' +
			'tableName VARCHAR(255) NOT NULL,' +
			'PRIMARY KEY(keyName, tableName)' +
			')';

		var sources = ["Nasa", "Eu", "Open"];

		var tables = [
			tNames,
			tSystem,
			tStarSystem,
			tPlanet,
			tStar,
			tPlanetStar,
			tBinary,
			tBinaryBinary,
			tStarBinary
		];

		var promises = [];
		sources.forEach(function(name) {
			tables.forEach(function(obj) {
				var promise = pool.getConnection()
					.then(function(connection) {
                        var args = name + obj;
						return connection.query('CREATE TABLE IF NOT EXISTS ' + args)
							.then(function(response) {
								console.log('Created ' + name + obj.substring(0, obj.indexOf('(')));
								pool.releaseConnection(connection);
							}).catch(function(err) {
								console.log(err);
								return (Q.reject(err));
							})
					});
				promises.push(promise);
			});
		});

		var promise = pool.getConnection()
			.then(function(connection) {
				return connection.query('CREATE TABLE IF NOT EXISTS ' + tUnderReview)
					.then(function(response) {
						console.log('Created NeedsReview');
						pool.releaseConnection(connection);
					}).catch(function(err) {
						console.log(err);
						return (Q.reject(err));
					})
			});
		promises.push(promise);

		Q.all(promises).then(function(data) {
			console.log('ending pool');
			pool.end();
			return resolve('Done!');
		}).catch(function(err) {
            console.log("error somewhere : ", err);
			pool.end();
			return resolve('Done with errors!');
		});
	});
    return promise;
};
