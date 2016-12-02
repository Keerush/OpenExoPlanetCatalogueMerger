const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const http = require('request-promise');
const bodyParser = require('body-parser');
const droptables = require('../models/dropTables.js');
const createtables = require('../models/createTables.js');
const addNASAData = require('../models/addNASAData.js');
const getUnderReview = require('../models/getUnderReview');
const editXMLData = require('../models/editXMLFiles');
const ignoreDiffs = require('../models/ignoreDiffs');

router.use(bodyParser.json());

router.get('/', (req, res, next) => {
	console.log("here");
	res.statusCode = 200
	res.send("API: Running!");
});

router.get('/dropTables/:password', function(req, res) {
	var password = 'test';
	if (req.params.password != password) {
		res.statusCode = 404;
		return res.send('Error 404: Invalid password.');
	}

	droptables().then(function(err) {
		res.statusCode = 200;
		res.send('drop tables.');
	});
});

router.get('/createTables/:password', function(req, res) {
	var password = 'test';
	if (req.params.password != password) {
		res.statusCode = 404;
		return res.send('Error 404: Invalid password.');
	}

	createtables().then(function(err) {
		res.statusCode = 200;
		res.send('created tables');
	});
});

router.get('/addNASAData', function(req, res) {
	addNASAData.addData().then(function(err) {
		if (err) {
			res.statusCode = 404;
			return res.send(err);
		}

		res.statusCode = 200;
		res.send('added data.');
	});
});

router.get('/getNasaStarDiff', (req, res) => {
	var limit = req.query.limit;
	var offset = req.query.offset;

	getUnderReview.getNasaStar(limit, offset)
		.then((data) => {
			res.statusCode = 200;
			return res.send(data);
		});
});

router.get('/getNasaPlanetDiff', (req, res) => {
	var limit = req.query.limit;
	var offset = req.query.offset;

	getUnderReview.getNasaPlanet(limit, offset)
		.then((data) => {
			res.statusCode = 200;
			return res.send(data);
		});
});

router.get('/getNasaSystemDiff', (req, res) => {
	var limit = req.query.limit;
	var offset = req.query.offset;

	getUnderReview.getNasaSystem(limit, offset)
		.then((data) => {
			res.statusCode = 200;
			return res.send(data);
		});
});

router.get('/getEuStarDiff', (req, res) => {
	var limit = req.query.limit;
	var offset = req.query.offset;

	getUnderReview.getEuStar(limit, offset)
		.then((data) => {
			res.statusCode = 200;
			return res.send(data);
		});
});

router.get('/getEuPlanetDiff', (req, res) => {
	var limit = req.query.limit;
	var offset = req.query.offset;

	getUnderReview.getEuPlanet(limit, offset)
		.then((data) => {
			res.statusCode = 200;
			return res.send(data);
		});
});

router.get('/getEuSystemDiff', (req, res) => {
	var limit = req.query.limit;
	var offset = req.query.offset;

	getUnderReview.getEuSystem(limit, offset)
		.then((data) => {
			res.statusCode = 200;
			return res.send(data);
		});
});

router.post('/editXmls', (req, res) => {
	if (Object.getOwnPropertyNames(req.body).length === 0 || req.body.length === 0) {
		res.statusCode = 400;
		return res.send('Invalid body.');
	}

	editXMLData(req.body)
		.then(() => {
			res.statusCode = 200;
			return res.send('ok');
		}).catch((err) => {
			res.statusCode = 500;
			return res.send(err);
		});
});

router.post('/ignoreDiffs', (req, res) => {
	if (Object.getOwnPropertyNames(req.body).length === 0 || req.body.length === 0) {
		res.statusCode = 400;
		return res.send('Invalid body.');
	}

	ignoreDiffs(req.body)
		.then(() => {
			res.statusCode = 200;
			return res.send('ok');
		}).catch((err) => {
			res.statusCode = 500;
			return res.send(err);
		});
});
module.exports = router;