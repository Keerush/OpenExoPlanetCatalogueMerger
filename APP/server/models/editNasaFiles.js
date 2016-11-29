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
	-Format for input data JSON:
		{
			editData: [{...}],
			ignoreData: [{...}]
		}

	-Format for editData: 
		list of objects that was sent by getNasaStar, getNasaSystem, and getNasaPlanet. (see getUnderReview.js)

	-Format for ignoreData: 
		list of {name, tableName} pairs
*/
module.exports = (data) => {
	var ignoreData = data.ignoreData.map((item) => [item.name, item.tableName]);

	// Update ignored UnderReview data.
	var promise = new Promise(function(resolve, reject) {
		var deleteQuery = 'DELETE FROM UnderReview WHERE (keyName, tableName) IN ?';
		var promises = [];
		console.log(ignoreData);
		var promise = pool.getConnection()
			.then((conn) => {
				return conn.query(deleteQuery, [[ignoreData]])
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