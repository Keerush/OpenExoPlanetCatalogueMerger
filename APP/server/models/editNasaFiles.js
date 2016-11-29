var config = require('../../config.js');

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

};