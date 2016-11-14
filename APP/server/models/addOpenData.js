var git = require('simple-git');
var mysql = require('promise-mysql');
var fs = require('fs');
var Q = require('q');

// Add to a config file.
var repoLoc = 'https://github.com/OpenExoplanetCatalogue/open_exoplanet_catalogue.git';
var folderPath = '/open_exoplanet_catalogue/systems/';
var localLoc = __dirname + folderPath;

function loadToDB() {
	var pool = mysql.createPool({
		host: 'sql9.freemysqlhosting.net',
		user: 'sql9142844',
		password: 'yiZUzq27ZS',
		database: 'sql9142844'
	});

	var promises = [];
	fs.readdir(localLoc, function(err, files) {
		if (err) {
			console.log('Could not walk through directory,');
			console.log(err);
			return;
		}

		files.forEach(function(file, index) {
			var fileR = localLoc + file;
			var promise = pool.getConnection()
				.then(function(conn) {
					return conn.query('LOAD XML LOCAL INFILE ? INTO TABLE OpenSystem ROWS IDENTIFIED BY "<system>" ', fileR)
						.then(function(res) {
							console.log('loaded system data from ' + file);
							pool.releaseConnection(conn);
						}).catch(function(err) {
							console.log(err);
						});
				});
			promises.push(promise);
		});

		Q.all(promises).then(function(data) {
			console.log('ending pool');
			pool.end();
		}).catch(function(err) {
			console.log("error somewhere");
			console.log(err);
			pool.end();
		});
	});


};

// clone the exoplanet repo.
fs.access(localLoc, fs.F_OK, function(err) {
	if (err) {
		git().clone(repoLoc, localLoc)
			.then(function(err) {
				console.log('Pulling open exoplanet repo completed.');
				loadToDB();
			});
	} else {
		loadToDB();
	}
});