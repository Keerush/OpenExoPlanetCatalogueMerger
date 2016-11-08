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
	'id INT NOT NULL PRIMARY KEY,' +
	'name VARCHAR(255) NOT NULL,' +
	'planet VARCHAR(255),' +
	'star VARCHAR(255),' +
	'V_binary VARCHAR(255),' +
	'declination VARCHAR(255),' +
	'right_ascension VARCHAR(255),' +
	'distance FLOAT,' +
	'videolink VARCHAR(255)' +
	')';

var tStarSystem = 'StarSystem(' +
	'star_ID INT NOT NULL PRIMARY KEY,' +
	'system_ID INT NOT NULL' +
	')';

var tPlanet = 'Planet(' +
	'id INT NOT NULL PRIMARY KEY,' +
	'name VARCHAR(255) NOT NULL,' +
	'semimajoraxis FLOAT,' +
	'separation FLOAT,' +
	'eccentricity FLOAT,' +
	'periastron FLOAT,' +
	'longitude FLOAT,' +
	'meananomaly FLOAT,' +
	'ascendingnode FLOAT,' +
	'inclination FLOAT,' +
	'impactparameter FLOAT,' +
	'period FLOAT,' +
	'transittime FLOAT,' +
	'periastrontime FLOAT,' +
	'maximumrvtime FLOAT,' +
	'mass FLOAT,' +
	'radius FLOAT,' +
	'temperature FLOAT,' +
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
	'lastupdate	DATE,' +
	'spinorbitalignment FLOAT' +
	')';

var tStar = 'Star(' +
	'id INT NOT NULL PRIMARY KEY,' +
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
				var promise = db.query('CREATE TABLE ' + obj.value)
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