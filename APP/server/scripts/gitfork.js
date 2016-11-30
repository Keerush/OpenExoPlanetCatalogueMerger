var gitstuff = require('../models/gitstuff.js');

gitstuff.pushDifferences("test","BlazeBlaster").then(function (result) {
	console.log(result);
});