const express = require('express');
const router = express.Router();

var bodyParser = require('body-parser')


function Middleware(req, res, next) {
	res.sendView = function(view) {
		console.log(__dirname + "/" + view)
		return res.sendFile(__dirname + "/" + view)
	}
	next();
}

router.use(Middleware)

router.get('*', (req, res, next) => {
	res.statusCode = 200
	console.log("here");
	res.sendView('index.html')
});

module.exports = router