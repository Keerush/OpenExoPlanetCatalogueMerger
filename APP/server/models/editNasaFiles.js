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

function editValue(oldVal, newVal) {
	if (typeof oldVal[0] === 'string') {
		return [newVal];
	} else {
		var editVal = oldVal[0];
		console.log(oldVal);
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

function findByKeyName(currObj, searchKey, name) {
	if (currObj instanceof Array) {
		for (var i = 0; i < currObj.length; i++) {
			var temp = findByKeyName(currObj[i], searchKey, name);
			if (typeof temp !== 'undefined') {
				return temp;
			}
		}
	} else if (currObj instanceof Object) {
		for (var currKey in currObj) {
			if (currKey == searchKey) {
				for (var i = 0; i < currObj[currKey].length; i++) {
					if (currObj[currKey][i].name.indexOf(name) > -1) {
						return currObj[currKey][i];
					}
				}
			}
			if (currObj[currKey] instanceof Object || currObj[currKey] instanceof Array) {
				var temp = findByKeyName(currObj[currKey], searchKey, name);
				if (typeof temp !== 'undefined') {
					return temp;
				}
			}
		}
	}
}

function editAttributes(data, editObj) {
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

/*
	-Format for editData:
		list of objects that was sent by getNasaStar, getNasaSystem, and getNasaPlanet. (see getUnderReview.js)
*/
module.exports = (editData) => {
	var promise = new Promise(function(resolve, reject) {
		// go through each entry, and read the files.
		editData.forEach((data) => {
			// convert to js object.
			var fileLoc = config.forkedRepoLocation + '/systems/' + data.filename;
			var filedata = fs.readFileSync(fileLoc);

			parser.parseString(filedata, function(err, result) {
				var editObj = {};
				if (data.tableName === 'System') {
					editObj = result.system;
					editAttributes(data, editObj);
				} else if (data.tableName === 'Star') {
					editObj = findByKeyName(result.system, 'star', data.name);
					editAttributes(data, editObj);
				} else {
					editObj = findByKeyName(result.system, 'planet', data.name);
					editAttributes(data, editObj);
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