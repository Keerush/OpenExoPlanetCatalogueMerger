var config = require('../../config.js');
var mysql = require('promise-mysql');
var Q = require('q');

// Intialize pool.
function initializePool() {
	var pool = mysql.createPool({
		host: config.mysql.host,
		user: config.mysql.username,
		password: config.mysql.password,
		database: config.mysql.database
	});
	return pool;
}

/*
	-Format for ignoreData: 
		list of {name, tableName} pairs
*/
module.exports = (ignoreData) => {
	var ignoreData = ignoreData.map((item) => [item.name, item.tableName]);

	// Update ignored UnderReview data.
	var promise = new Promise(function(resolve, reject) {
		var pool = initializePool();
		var deleteQuery = 'DELETE FROM UnderReview WHERE (keyName, tableName) IN ?';
		var promises = [];

		var promise = pool.getConnection()
			.then((conn) => {
				return conn.query(deleteQuery, [
						[ignoreData]
					])
					.then(() => {
						pool.releaseConnection(conn);
					});
			});
		promises.push(promise);

		// Wait for all promises to be reviewed.
		Q.all(promises).then(function(data) {
			console.log('ending pool');
			resolve('Done');
			pool.end();
		}).catch(function(err) {
			console.log("error somewhere : ", err);
			resolve('Done');
			pool.end();
		});
	});

	return promise;
};