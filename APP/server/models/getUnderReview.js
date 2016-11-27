var config = require('../../config.js');
var Q = require('q');
var mysql = require('promise-mysql');

// Intialize pool.
var pool = mysql.createPool({
	host: config.mysql.host,
	user: config.mysql.username,
	password: config.mysql.password,
	database: config.mysql.database
});

// Get all items in needs review.

// Get information from nasa/eu.

// Get information from open.

// Return data pairs of nasa/eu and open.

// Wait for all promises to be reviewed.
Q.all(promises).then(function(data) {
	console.log('ending pool');
	pool.end();
	return resolve('Done!');
}).catch(function(err) {
	console.log("error somewhere : ", err);
	pool.end();
	return resolve('Done with errors!');
});