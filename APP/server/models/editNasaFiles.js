var config = require('../../config.js');
var mysql = require('promise-mysql');
var Q = require('q');

// Intialize pool.
var pool = mysql.createPool({
	host: config.mysql.host,
	user: config.mysql.username,
	password: config.mysql.password,
	database: config.mysql.database
});

/*
	-Format for editData: 
		list of objects that was sent by getNasaStar, getNasaSystem, and getNasaPlanet. (see getUnderReview.js)
*/
module.exports = (editData) => {
	
};