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
	'id INT NOT NULL PRIMARY KEY,' +
	'name VARCHAR(255) NOT NULL' +
	')';

var tSystem = 'System(' +
	'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
	'name VARCHAR(255) NOT NULL,' +
	'declination VARCHAR(255),' +
	'rightascension VARCHAR(255),' +
	'distance FLOAT,' +
	'distanceminus FLOAT,' +
	'distanceplus FLOAT,' +
	'videolink VARCHAR(255)' +
	')';

var tStarSystem = 'StarSystem(' +
	'star_ID INT NOT NULL PRIMARY KEY,' +
	'system_ID INT NOT NULL' +
	')';

var tPlanet = 'Planet(' +
	'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
	'name VARCHAR(255) NOT NULL,' +
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
	'magB VARCHAR(255),' +
	'magV VARCHAR(255),' +
	'magR VARCHAR(255),' +
	'magI VARCHAR(255),' +
	'magJ VARCHAR(255),' +
	'magH VARCHAR(255),' +
	'magK VARCHAR(255),' +
	'discoverymethod VARCHAR(255),' +
	'istransiting INT,' +
	'description VARCHAR(255),' +
	'discoveryyear INT,' +
	'lastupdate	VARCHAR(255),' +
	'spinorbitalignment FLOAT' +
	')';

var tStar = 'Star(' +
	'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
	'name VARCHAR(255) NOT NULL,' +
	'mass FLOAT,' +
	'radius FLOAT,' +
	'temperature FLOAT,' +
	'age FLOAT,' +
	'metallicity FLOAT,' +
	'spectraltype VARCHAR(255),' +
	'magB VARCHAR(255),' +
	'magV VARCHAR(255),' +
	'magR VARCHAR(255),' +
	'magI VARCHAR(255),' +
	'magJ VARCHAR(255),' +
	'magH VARCHAR(255),' +
	'magK VARCHAR(255)' +
	')';

var tPlanetStar = 'PlanetStar(' +
	'planet_ID INT NOT NULL PRIMARY KEY,' +
	'star_ID INT NOT NULL' +
	')';

var tBinary = 'tBinary(' +
	'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
	'name VARCHAR(255) NOT NULL,' +
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
	'binary_ID INT NOT NULL PRIMARY KEY,' +
	'other_binary_ID INT NOT NULL' +
	')';

var tStarBinary = 'StarBinary(' +
	'star_ID INT NOT NULL PRIMARY KEY,' +
	'binary_ID INT NOT NULL' +
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