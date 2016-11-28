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

module.exports = {
	getSystem: () => {
		var promise = new Promise(function(resolve, reject) {
			// Get all items in needs review.
			var query = 'SELECT x.name as n_name, x.declination as n_declination, x.rightascension as n_rightascension, x.distance as n_distance, x.distanceminus as n_distanceminus, x.distanceplus as n_distanceplus, x.lastupdate as n_lastupdate, y.* FROM ((SELECT a.* FROM NasaSystem a JOIN UnderReview b ON a.name=b.keyName AND tablename="NasaSystem") x JOIN OpenSystem y ON x.name=y.name);';
			var promises = [];
			var systemDiffs = [];
			var output = [];

			// Get information from nasa.
			var promise = pool.getConnection()
				.then((conn) => {
					return conn.query(query)
						.then((rows) => {
							// Return data pairs of nasa/eu and open.
							rows.forEach((row) => {
								var nasa = {},
									open = {};
								for (var key in row) {
									if (key.startsWith('n_')) {
										nasa[key] = row[key];
									} else {
										open[key] = row[key];
									}
								}

								output.push({
									'nasa': nasa,
									'open': open
								});
							});
							pool.releaseConnection(conn);
						});
				});
			promises.push(promise);

			// Wait for all promises to be reviewed.
			Q.all(promises).then(function(data) {
				console.log('ending pool');
				resolve(output);
				pool.end();
			}).catch(function(err) {
				console.log("error somewhere : ", err);
				resolve(output);
				pool.end();
			});
		});
		return promise;
	}
};