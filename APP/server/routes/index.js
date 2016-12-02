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
const fork = require('../models/gitfork');
const pullRequest = require('../models/gitpullrequest')
router.use(bodyParser.json());

router.get('/', (req, res, next) => {
	console.log("here");
	res.statusCode = 200
	res.send("API: Running!");
});

router.get('/nasaData', function(req, res) {
	var options = {
		uri: 'http://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&format=json&select=pl_hostname,pl_letter,dec_str,ra_str,st_dist,pl_orbsmax,pl_orbsmaxerr1,pl_orbsmaxerr2,pl_orbeccen,pl_orbeccenerr1,pl_orbeccenerr2,pl_orblper,pl_orblpererr1,pl_orblpererr2,pl_orbincl,pl_orbinclerr1,pl_orbinclerr2,pl_orbper,pl_orbpererr1,pl_orbpererr2,pl_tranmid,pl_tranmiderr1,pl_tranmiderr2,st_mass,st_masserr1,st_masserr2,pl_radj,pl_radjerr1,pl_radjerr2,pl_eqt,pl_eqterr1,pl_eqterr2,st_age,st_ageerr1,st_ageerr2,st_metratio,st_spstr,st_ssperr,st_bj,st_bjerr,st_vj,st_vjerr,st_rc,st_rcerr,st_ic,st_icerr,st_j,st_jerr,st_h,st_herr,st_k,st_kerr,pl_discmethod,pl_disc,rowupdate',
		json: true // Automatically parses the JSON string in the response
	};
	http(options).then(function(result) {
		// Do stuff with response
		res.send(result);
	});
});

router.put('/fork', function (req, res) {
	if (req.access_token) {
		fork(req.access_token).then(function (response) {
			pullRequest(req.access_token);
		})
	}
})
router.get('/euData', function(req, res) {
	var options = {
		uri: 'http://exoplanet.eu/catalog/csv',
		json: true // Automatically parses the JSON string in the response
	};
	http(options).then(function(result) {
		// Do stuff with response
		res.send(result);
	});
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
	if (!req.body && !req.body.nasa) {
		res.statusCode = 400;
		console.log("????")
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
