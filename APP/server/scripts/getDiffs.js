var getData = require('../models/getUnderReview.js');
var Q = require('q');

getData.getSystem().then((res) => {
	console.log(res);
});