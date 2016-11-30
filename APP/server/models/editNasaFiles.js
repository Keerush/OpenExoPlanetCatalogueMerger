var config = require('../../config.js');
var mysql = require('promise-mysql');
var Q = require('q');
var xml2js = require('xml2js');
var fs = require('fs');

// Intialize pool.
var pool = mysql.createPool({
	host: config.mysql.host,
	user: config.mysql.username,
	password: config.mysql.password,
	database: config.mysql.database
});

var parser = new xml2js.Parser();
var builder = new xml2js.Builder({
	'headless': true,
	'renderOpts': {
		'pretty': true,
		'indent': '\t',
		'newline': '\n'
	}
});

function editFileAttribute(newVal, fileVals) {
	// Does not have a error plus and minus value.
	if (typeof fileVals[0] === 'string') {
		return [newVal];
	}
}

/*
	-Format for editData: 
		list of objects that was sent by getNasaStar, getNasaSystem, and getNasaPlanet. (see getUnderReview.js)
*/
module.exports = (editData) => {
	var promise = new Promise(function(resolve, reject) {
		// go through each entry, and read the files.
		editData.forEach((data) => {
			// convert to js object.
			var fileLoc = config.masterRepoLocation + '/systems/' + data.filename;
			fs.readfile(fileLoc, function(err, data) {
				parser.parseString(data, function(err, result) {
					var editObj = {};
					if (data.tableName === 'System') {
						editObj = data.system;
						if (data.declination != null) {
							result.declination = editFileAttribute(data.declination, result.declination);
						}
					}
				});
			});

			// for each data properity replace file
		});
	});

	return promise;
};