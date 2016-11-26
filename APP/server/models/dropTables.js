var config = require('../../config.js')
var mysql = require('promise-mysql');
var Q = require('q');

module.exports = () => {

		var pool = mysql.createPool({
			host: config.mysql.host,
			user: config.mysql.username,
			password: config.mysql.password,
			database: config.mysql.database
		});

		return pool.query("DROP DATABASE " + config.mysql.database).then(function(res) {
			return pool.query("CREATE DATABASE " + config.mysql.database).then(function (res) {
				pool.end();
			})
			console.log(res);
		}).catch(function (err) {
			pool.end();
		});

};
