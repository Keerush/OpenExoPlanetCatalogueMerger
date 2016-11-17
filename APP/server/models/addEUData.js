var mysql = require('promise-mysql');
var request = require('request');
var Q = require('q');
var fs = require('fs');

exports.addData = function() {
	var promise = new Promise(function(resolve, reject) {
		var pool = mysql.createPool({
			host: 'sql9.freemysqlhosting.net',
			user: 'sql9142844',
			password: 'yiZUzq27ZS',
			database: 'sql9142844'
		});

		var url = 'http://exoplanet.eu/catalog/csv';

		console.log('Getting data from exoplanet.eu');
		request({
			url: url,
			json: true
		}, function(err, response, data) {

		});
	});
	return promise;
};