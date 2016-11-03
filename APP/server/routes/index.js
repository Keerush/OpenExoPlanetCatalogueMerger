const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const http = require('request-promise');

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'index.html'));
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

module.exports = router;