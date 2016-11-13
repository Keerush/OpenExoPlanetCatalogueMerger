var mysql = require('mysql');
var Q = require('q');

exports.dropTable = function() {
	var pool = mysql.createPool({
		host: 'sql9.freemysqlhosting.net',
		user: 'sql9142844',
		password: 'yiZUzq27ZS',
		database: 'sql9142844'
	});

	var db = {
		query: function(sql, params) {
			var deferred = Q.defer();
			pool.query(sql, params, deferred.makeNodeResolver());

			return (deferred.promise);
		}
	};


var tables = [
	'NasaNames',
	'NasaSystem',
	'NasaStarSystem',
	'NasaPlanet',
	'NasaStar',
	'NasaPlanetStar',
	'NasaBinary',
	'NasaBinaryBinary',
	'NasaStarBinary'
];

	var promises = tables.map(function(table) {
		var promise = db.query('SELECT COUNT(*) AS tableCount FROM information_schema.tables WHERE table_schema="sql9142844" AND table_name="' + table + '";')
			.then(function(res) {
				if (res[0][0].tableCount == 1) {
					var promise = db.query('DROP TABLE ' + table)
						.then(function(res) {
							console.log('Dropped table ' + table + '.');
						}, function(err) {
							console.log('Cannot drop table ' + table + '\n' + err);
							return (Q.reject(err));
						});
					return (promise);
				} else {
					console.log(table + ' does not exist.');
				}
			}, function(err) {
				console.log('Cannot drop table ' + table + '\n');
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
};