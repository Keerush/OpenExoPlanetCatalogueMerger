var getData = require('../models/getUnderReview.js');
var Q = require('q');

getData.getNasaStar().then((res) => {
	console.log(res);
});