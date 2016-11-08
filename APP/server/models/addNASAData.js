var mysql = require('mysql');
var request = require('request');
var Q = require('q');
var fs = require('fs');

var url = 'http://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&format=json&select=*';
var dest = __dirname + '/test.txt';
var file = fs.createWriteStream(dest);

request({
	url: url,
	json: true
}, function(error, response, data) {
	if (!error && response.statusCode === 200) {
		console.log(data); // Print the json response
	}
})