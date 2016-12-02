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
			'email VARCHAR(255) PRIMARY KEY NOT NULL,' +
      'name VARCHAR(255) NOT NULL' +
			'otherName VARCHAR(255) NOT NULL' +
			')' + ;

		var tables = [tNames];

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
