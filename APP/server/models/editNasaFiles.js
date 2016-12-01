var config = require('../../config.js');
var xml2js = require('xml2js');
var fs = require('fs');
var removeUnderReview = require('./ignoreDiffs.js');

var parser = new xml2js.Parser();
var builder = new xml2js.Builder({
	'headless': true,
	'renderOpts': {
		'pretty': true,
		'indent': '\t',
		'newline': '\n'
	}
});

function getOldVal(oldVal) {
	if (typeof oldVal !== 'undefined') {
		return oldVal[0];
	} else {
		return '*';
	}
}

function editValue(oldVal, newVal, type, unit) {
	var val = getOldVal(oldVal);
	if (typeof val === 'string') {
		return [newVal];
	} else {
		var editVal = val;
		editVal['_'] = newVal;
		if (type !== '') {
			editVal['$']['type'] = type;
		}
		if (unit !== '') {
			editVal['$']['unit'] = unit;
		}
		return [editVal];
	}
}

function editPlus(oldVal, newVal, type, unit) {
	var editVal = {};
	var val = getOldVal(oldVal);

	if (typeof val === 'string') {
		editVal['_'] = val;
		editVal['$'] = {
			'errorminus': '',
			'errorplus': newVal
		};
	} else {
		editVal = val;
		editVal['$']['errorplus'] = newVal;
	}

	if (type !== '') {
		editVal['$']['type'] = type;
	}
	if (unit !== '') {
		editVal['$']['unit'] = type;
	}
	return [editVal];
}

function editMinus(oldVal, newVal, type, unit) {
	var editVal = {};
	var val = getOldVal(oldVal);

	if (typeof val === 'string') {
		editVal['_'] = val;
		editVal['$'] = {
			'errorminus': newVal,
			'errorplus': ''
		};
	} else {
		editVal = val;
		editVal['$']['errorminus'] = newVal;
	}
	if (type !== '') {
		editVal['$']['type'] = type;
	}
	if (unit !== '') {
		editVal['$']['unit'] = type;
	}
	return [editVal];
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
		if (attribute !== 'filename' && attribute !== 'tableName' && attribute !== 'name' && data[attribute] !== null) {
			var parentAttribute = attribute;
			var type = '',
				unit = '';

			if (attribute.includes('separation')) {
				parentAttribute = 'separation';
				if (parentAttribute.includes('arcsec')) {
					unit = 'arcsec';
				} else {
					unit = 'AU';
				}
			} else if (attribute.includes('mass')) {
				parentAttribute = 'mass';
				if (parentAttribute.includes('msini')) {
					type = 'msini';
				}
			}
			if (attribute.endsWith('plus')) {
				parentAttribute = parentAttribute.replace('plus', '');
				editObj[parentAttribute] = editPlus(editObj[parentAttribute], data[attribute], type, unit);
			} else if (attribute.endsWith('minus')) {
				parentAttribute = parentAttribute.replace('minus', '');
				editObj[parentAttribute] = editMinus(editObj[parentAttribute], data[attribute], type, unit);
			} else {
				editObj[parentAttribute] = editValue(editObj[parentAttribute], data[attribute], type, unit);
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
				if (data.tableName.includes('System')) {
					editObj = result.system;
					editAttributes(data, editObj);
				} else if (data.tableName.includes('Star')) {
					editObj = findByKeyName(result.system, 'star', data.name);
					editAttributes(data, editObj);
				} else {
					editObj = findByKeyName(result.system, 'planet', data.name);
					editAttributes(data, editObj);
				}

				// Write edited xml.
				var newXml = builder.buildObject(result);
				fs.writeFile(fileLoc, newXml, function(err) {
					if (err) {
						console.log(err);
					} else {
						// remove from underreview table.
						removeUnderReview([{
							'name': data.name,
							'tableName': data.tableName
						}]).then(() => {
							resolve('done');
						});
					}
				});
			});
		});
	});

	return promise;
};