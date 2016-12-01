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
	if (newVal.endsWith('plus') || newVal.endsWith('minus'))
		if (typeof fileVals[0] === 'string') {
			return [newVal];
		}
}

function editValue(oldVal, newVal) {
	if (typeof oldVal[0] === 'string') {
		return [newVal];
	} else {
		var editVal = oldVal;
		editVal['_'] = newVal;
		return editVal;
	}
}

function editPlus(oldVal, newVal) {
	var editVal = {};

	if (typeof oldVal[0] === 'string') {
		editVal['_'] = oldVal[0];
		editVal['$'] = {
			'errorminus': '',
			'errorplus': newVal
		};
	} else {
		editVal = oldVal[0];
		editVal['$']['errorplus'] = newVal;
	}
	console.log(editVal);
	return editVal;
}

function editMinus(oldVal, newVal) {
	var editVal = {};
	if (typeof oldVal[0] === 'string') {
		editVal['_'] = oldVal[0];
		editVal['$'] = {
			'errorminus': newVal,
			'errorplus': ''
		};
	} else {
		editVal = oldVal[0];
		editVal['$']['errorminus'] = newVal;
	}
	return editVal;
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
			var filedata = fs.readFileSync(fileLoc);

			parser.parseString(filedata, function(err, result) {
				var editObj = {};
				if (data.tableName === 'System') {
					editObj = result.system;
					for (var attribute in data) {
						if (attribute !== 'filename' && attribute !== 'tableName' && attribute !== 'name') {
							if (attribute.endsWith('plus')) {
								var parentAttribute = attribute.replace('plus', '');
								editObj[parentAttribute] = editPlus(editObj[parentAttribute], data[attribute]);
							} else if (attribute.endsWith('minus')) {
								var parentAttribute = attribute.replace('minus', '');
								editObj[parentAttribute] = editMinus(result[parentAttribute], data[attribute]);
							} else {
								editObj[attribute] = editValue(editObj[attribute], data[attribute]);
							}
						}
					}
				}

				// Write edited xml.
				var newXml = builder.buildObject(result);
				fs.writeFile(fileLoc, newXml, function(err) {
					if (err)
						console.log(err);
				});
			});
		});
		resolve('done');
	});

	return promise;
};