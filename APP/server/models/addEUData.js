var config = require('../../config.js')
var Converter = require("csvtojson").Converter;
var mysql = require('promise-mysql');
var request = require('request');
var Q = require('q');
var fs = require('fs');

module.exports = () => {
	var promise = new Promise(function(resolve, reject) {
		var pool = mysql.createPool({
			host: config.mysql.host,
			user: config.mysql.username,
			password: config.mysql.password,
			database: config.mysql.database
		});

		var url = config.exoplanet.url;
		var converter = new Converter();
		console.log('Getting data from exoplanet.eu');
		converter.on("end_parsed", function (jsonArray) {
			console.log(jsonArray);
			return resolve();
		});
		request.get(url).pipe(converter);

	});
	return promise;
};
