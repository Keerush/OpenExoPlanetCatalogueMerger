var config = require('../../config.js')
var mysql = require('promise-mysql');
var request = require('request');
var Q = require('q');
var fs = require('fs');

exports.addData = function() {
	var promise = new Promise(function(resolve, reject) {
		var pool = mysql.createPool({
			host: config.mysql.host,
			user: config.mysql.username,
			password: config.mysql.password,
			database: config.mysql.database
		});

		var url = config.exoplanet.url;

		console.log('Getting data from exoplanet.eu');
		request({
			url: url,
			json: true
		}, function(err, response, data) {

		});
	});
	return promise;
};
