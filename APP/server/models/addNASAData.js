var mysql = require('mysql');
var request = require('request');
var Q = require('q');
var fs = require('fs');

var pool = mysql.createPool({
	host: 'sql9.freemysqlhosting.net',
	user: 'sql9142844',
	password: 'yiZUzq27ZS',
	database: 'sql9142844'
});

var url = 'http://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&format=json&select=pl_hostname,pl_letter,dec_str,ra_str,st_dist,st_disterr1,st_disterr2,pl_orbsmax,pl_orbsmaxerr1,pl_orbsmaxerr2,pl_orbeccen,pl_orbeccenerr1,pl_orbeccenerr2,pl_orblper,pl_orblpererr1,pl_orblpererr2,pl_orbincl,pl_orbinclerr1,pl_orbinclerr2,pl_imppar,pl_impparerr1,pl_impparerr2,pl_orbper,pl_orbpererr1,pl_orbpererr2,pl_tranmid,pl_tranmiderr1,pl_tranmiderr2,pl_orbtper,pl_orbtpererr1,pl_orbtpererr2,pl_massj,pl_massjerr1,pl_massjerr2,pl_msinij,pl_msinijerr1,pl_msinijerr2,st_mass,st_masserr1,st_masserr2,pl_radj,pl_radjerr1,pl_radjerr2,pl_eqt,pl_eqterr1,pl_eqterr2,st_age,st_ageerr1,st_ageerr2,st_metratio,st_spstr,st_ssperr,st_bj,st_bjerr,st_vj,st_vjerr,st_rc,st_rcerr,st_ic,st_icerr,st_j,st_jerr,st_h,st_herr,st_k,st_kerr,pl_discmethod,pl_ttvflag,pl_disc,rowupdate';

var db = {
	query: function(sql, params) {
		var deferred = Q.defer();
		pool.query(sql, params, deferred.makeNodeResolver());

		return (deferred.promise);
	}
};

console.log('Getting data from NASA');
request({
	url: url,
	json: true
}, function(err, response, data) {
	if (!err && response.statusCode === 200) {
		console.log('Recieved NASA data.');
		var systemInput = '',
			planetInput = '';
		var neededConn = 2;
		data.forEach(function(item) {
			systemInput += '("' + item.pl_hostname + '","' + item.dec_str + '","' + item.ra_str + '",' + item.st_dist + ',' + item.st_disterr1 + ',' + item.st_disterr2 + '),';

			planetInput += '("' + item.pl_hostname + '",' + item.pl_orbsmax + ',' + item.pl_orbsmaxerr2 + ',' + item.pl_orbsmaxerr1 + ',' + item.pl_orbeccen + ',' + item.pl_orbeccenerr2 + ',' + item.pl_orbeccenerr1 + ',' + item.pl_orblper + ',' + item.pl_orblpererr1 + ',' + item.pl_orblpererr2 + ',' + item.pl_orbincl + ',' + item.pl_orbinclerr1 + ',' + item.pl_orbinclerr2 + ',' + item.pl_imppar + ',' + item.pl_impparerr1 + ',' + item.pl_impparerr2 + ',' + item.pl_orbper + ',' + item.pl_orbpererr1 + ',' + item.pl_orbpererr2 + ',' + item.pl_tranmid + ',' + item.pl_tranmiderr1 + ',' + item.pl_tranmiderr2 + ',' + item.pl_orbtper + ',' + item.pl_orbtpererr1 + ',' + item.pl_orbtpererr2 + ',' + item.pl_massj + ',' + item.pl_massjerr1 + ',' + item.pl_massjerr2 + ',' + item.pl_msinij + ',' + item.pl_msinijerr1 + ',' + item.pl_msinijerr2 + ',' + item.pl_radj + ',' + item.pl_radjerr1 + ',' + item.pl_radjerr2 + ',' + item.pl_eqt + ',' + item.pl_eqterr1 + ',' + item.pl_eqterr2 + ',"' + item.pl_discmethod + '",' + item.pl_ttvflag + ',"' + item.pl_disc + '",' + item.rowupdate + '),'
		});

		systemInput = systemInput.replace(/,\s*$/, "");
		planetInput = planetInput.replace(/,\s*$/, "");

		console.log('Inserting NASA data into database.');
		var systemQuery = 'INSERT INTO System (name, declination, rightascension, distance, distanceplus, distanceminus) VALUES ' + systemInput + ';';
		var planetQuery = 'INSERT INTO Planet (name, semimajoraxis, semimajoraxisminus, semimajoraxisplus, eccentricity, eccentricityminus, eccentricityplus, periastron, periastronplus, periastronminus, inclination, inclinationplus, inclinationminus, impactparameter, impactparameterplus, impactparameterminus, period, periodplus, periodminus, transittime, transittimeplus, transittimeminus, periastrontime, periastrontimeplus, periastrontimeminus, massjupiter, massjupiterplus, massjupiterminus, massmsini, massmsiniplus, massmsiniminus, radius, radiusplus, radiusminus, temperature, temperatureplus, temperatureminus, discoverymethod, istransiting, discoveryyear, lastupdate) VALUES ' + planetInput + ';';

		var queries = [{
			key: 'System',
			value: systemQuery
		}, {
			key: 'Planet',
			value: planetQuery
		}];

		var promises = queries.map(function(i_query) {
			var promise = db.query(i_query.value)
				.then(function(res) {
					console.log('Inserted ' + i_query.key + ' NASA complete.');
				}, function(err) {
					console.log('Could not insert' + i_query.key + ' NASA data.\n' + err);
					return (Q.reject(err));
				});
			return (promise);
		});

		Q.allSettled(promises)
			.then(
				function(snap) {
					console.log('Inserted all NASA data.');
					pool.end();
				}
			);
	}
});