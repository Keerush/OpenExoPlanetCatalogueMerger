var mysql = require('mysql');
var Q = require('q');

var pool = mysql.createPool({
	host: 'sql9.freemysqlhosting.net',
	user: 'sql9142844',
	password: 'yiZUzq27ZS',
	database: 'sql9142844'
});

// Create tables.
var tNames = 'Names(' +
	'name VARCHAR(255) PRIMARY KEY NOT NULL,' +
	'otherName VARCHAR(255) NOT NULL' +
	')';

var tSystem = 'System(' +
	'name VARCHAR(255) PRIMARY KEY NOT NULL,' +
	'declination VARCHAR(255),' +
	'rightascension VARCHAR(255),' +
	'distance FLOAT,' +
	'distanceminus FLOAT,' +
	'distanceplus FLOAT,' +
	'videolink VARCHAR(255)' +
	')';

var tStarSystem = 'StarSystem(' +
	'starName VARCHAR(255) NOT NULL PRIMARY KEY,' +
	'systemName VARCHAR(255) NOT NULL' +
	')';

var tPlanet = 'Planet(' +
	'name VARCHAR(255) PRIMARY KEY NOT NULL,' +
	'semimajoraxis FLOAT,' +
	'semimajoraxisminus FLOAT,' +
	'semimajoraxisplus FLOAT,' +
	'separation FLOAT,' +
	'eccentricity FLOAT,' +
	'eccentricityminus FLOAT,' +
	'eccentricityplus FLOAT,' +
	'periastron FLOAT,' +
	'periastronminus FLOAT,' +
	'periastronplus FLOAT,' +
	'longitude FLOAT,' +
	'meananomaly FLOAT,' +
	'ascendingnode FLOAT,' +
	'inclination FLOAT,' +
	'inclinationminus FLOAT,' +
	'inclinationplus FLOAT,' +
	'impactparameter FLOAT,' +
	'impactparameterminus FLOAT,' +
	'impactparameterplus FLOAT,' +
	'period FLOAT,' +
	'periodminus FLOAT,' +
	'periodplus FLOAT,' +
	'transittime FLOAT,' +
	'transittimeminus FLOAT,' +
	'transittimeplus FLOAT,' +
	'periastrontime FLOAT,' +
	'periastrontimeminus FLOAT,' +
	'periastrontimeplus FLOAT,' +
	'maximumrvtime FLOAT,' +
	'maximumrvtimeminus FLOAT,' +
	'maximumrvtimeplus FLOAT,' +
	'massjupiter FLOAT,' +
	'massjupiterminus FLOAT,' +
	'massjupiterplus FLOAT,' +
	'massmsini FLOAT,' +
	'massmsiniminus FLOAT,' +
	'massmsiniplus FLOAT,' +
	'radius FLOAT,' +
	'radiusminus FLOAT,' +
	'radiusplus FLOAT,' +
	'temperature FLOAT,' +
	'temperatureminus FLOAT,' +
	'temperatureplus FLOAT,' +
	'age FLOAT,' +
	'spectraltype VARCHAR(255),' +
	'magB FLOAT,' +
	'magBminus FLOAT,' +
	'magBplus FLOAT,' +
	'magV FLOAT,' +
	'magVminus FLOAT,' +
	'magVplus FLOAT,' +
	'magR FLOAT,' +
	'magRminus FLOAT,' +
	'magRplus FLOAT,' +
	'magI FLOAT,' +
	'magIminus FLOAT,' +
	'magIplus FLOAT,' +
	'magJ FLOAT,' +
	'magJminus FLOAT,' +
	'magJplus FLOAT,' +
	'magH FLOAT,' +
	'magHminus FLOAT,' +
	'magHplus FLOAT,' +
	'magK FLOAT,' +
	'magKminus FLOAT,' +
	'magKplus FLOAT,' +
	'discoverymethod VARCHAR(255),' +
	'istransiting INT,' +
	'description VARCHAR(255),' +
	'discoveryyear INT,' +
	'lastupdate	VARCHAR(255),' +
	'spinorbitalignment FLOAT' +
	')';

var tStar = 'Star(' +
	'name VARCHAR(255) PRIMARY KEY NOT NULL,' +
	'mass FLOAT,' +
	'massminus FLOAT,' +
	'massplus FLOAT,' +
	'radius FLOAT,' +
	'radiusminus FLOAT,' +
	'radiusplus FLOAT,' +
	'temperature FLOAT,' +
	'temperatureminus FLOAT,' +
	'temperatureplus FLOAT,' +
	'age FLOAT,' +
	'ageminus FLOAT,' +
	'ageplus FLOAT,' +
	'metallicity FLOAT,' +
	'metallicityminus FLOAT,' +
	'metallicityplus FLOAT,' +
	'spectraltype VARCHAR(255),' +
	'magB FLOAT,' +
	'magBminus FLOAT,' +
	'magBplus FLOAT,' +
	'magV FLOAT,' +
	'magVminus FLOAT,' +
	'magVplus FLOAT,' +
	'magR FLOAT,' +
	'magRminus FLOAT,' +
	'magRplus FLOAT,' +
	'magI FLOAT,' +
	'magIminus FLOAT,' +
	'magIplus FLOAT,' +
	'magJ FLOAT,' +
	'magJminus FLOAT,' +
	'magJplus FLOAT,' +
	'magH FLOAT,' +
	'magHminus FLOAT,' +
	'magHplus FLOAT,' +
	'magK FLOAT,' +
	'magKminus FLOAT,' +
	'magKplus FLOAT' +
	')';

var tPlanetStar = 'PlanetStar(' +
	'planetName VARCHAR(255) NOT NULL PRIMARY KEY,' +
	'starName VARCHAR(255) NOT NULL' +
	')';

var tBinary = 'tBinary(' +
	'name VARCHAR(255) PRIMARY KEY NOT NULL,' +
	'semimajoraxis FLOAT,' +
	'separation FLOAT,' +
	'positionangle FLOAT,' +
	'eccentricity FLOAT,' +
	'periastron FLOAT,' +
	'longitude FLOAT,' +
	'meananomaly FLOAT,' +
	'ascendingnode FLOAT,' +
	'inclination FLOAT,' +
	'period FLOAT,' +
	'transittime FLOAT,' +
	'periastrontime FLOAT,' +
	'maximumrvtime FLOAT,' +
	'magB VARCHAR(255),' +
	'magV VARCHAR(255),' +
	'magR VARCHAR(255),' +
	'magI VARCHAR(255),' +
	'magJ VARCHAR(255),' +
	'magH VARCHAR(255),' +
	'magK VARCHAR(255)' +
	')';

var tBinaryBinary = 'BinaryBinary(' +
	'binaryName VARCHAR(255) NOT NULL PRIMARY KEY,' +
	'otherBinaryName VARCHAR(255) NOT NULL' +
	')';

var tStarBinary = 'StarBinary(' +
	'starName VARCHAR(255) NOT NULL PRIMARY KEY,' +
	'binaryName VARCHAR(255) NOT NULL' +
	')';

var tables = [{
	key: 'Names',
	value: tNames
}, {
	key: 'System',
	value: tSystem
}, {
	key: 'StarSystem',
	value: tStarSystem
}, {
	key: 'Planet',
	value: tPlanet
}, {
	key: 'Star',
	value: tStar
}, {
	key: 'PlanetStar',
	value: tPlanetStar
}, {
	key: 'tBinary',
	value: tBinary
}, {
	key: 'BinaryBinary',
	value: tBinaryBinary
}, {
	key: 'StarBinary',
	value: tStarBinary
}];

var db = {
	query: function(sql, params) {
		var deferred = Q.defer();
		pool.query(sql, params, deferred.makeNodeResolver());

		return (deferred.promise);
	}
};

var promises = tables.map(function(obj) {
	var promise = db.query('SELECT COUNT(*) AS tableCount FROM information_schema.tables WHERE table_schema="sql9142844" AND table_name="' + obj.key + '";')
		.then(function(res) {
			if (res[0][0].tableCount == 0) {
				var promise = db.query('CREATE TABLE ' + obj.value + ';')
					.then(function(res) {
						console.log('Created table ' + obj.key + '.');
					}, function(err) {
						console.log('Cannot create ' + obj.key + '\n' + err);
						return (Q.reject(err));
					});
				return (promise);
			} else {
				console.log(obj.key + ' exists.');
			}
		}, function(err) {
			console.log('Cannot create ' + obj.key + '\n');
			console.log(err);
			return (Q.reject(err));
		});
	return (promise);
});

Q.allSettled(promises)
	.then(
		function(snap) {
			pool.end();
		}
	);