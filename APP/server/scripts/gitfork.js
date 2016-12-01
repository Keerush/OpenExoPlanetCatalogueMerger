var gitstuff = require('../models/gitfork.js');

gitstuff.forkRepo("test","BlazeBlaster").then(function (result) {
	console.log(result);
});