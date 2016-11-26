module.exports = {
	"directory" : __dirname,
	"mysql": {
		"host": "cmsvm35.utsc.utoronto.ca",
		"username": "student",
		"port": "3306",
		"password": "password",
		"database": "NASA"
	},
	"exoplanet": {
		"url": "http://exoplanet.eu/catalog/csv"
	},
	"nasa": {
		"url": "http://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&format=json&select=pl_hostname,pl_letter,dec_str,ra_str,st_dist,st_disterr1,st_disterr2,pl_orbsmax,pl_orbsmaxerr1,pl_orbsmaxerr2,pl_orbeccen,pl_orbeccenerr1,pl_orbeccenerr2,pl_orblper,pl_orblpererr1,pl_orblpererr2,pl_orbincl,pl_orbinclerr1,pl_orbinclerr2,pl_imppar,pl_impparerr1,pl_impparerr2,pl_orbper,pl_orbpererr1,pl_orbpererr2,pl_tranmid,pl_tranmiderr1,pl_tranmiderr2,pl_orbtper,pl_orbtpererr1,pl_orbtpererr2,pl_massj,pl_massjerr1,pl_massjerr2,pl_msinij,pl_msinijerr1,pl_msinijerr2,st_mass,st_masserr1,st_masserr2,st_rad,st_raderr1,st_raderr2,st_teff,st_tefferr1,st_tefferr2,pl_radj,pl_radjerr1,pl_radjerr2,pl_eqt,pl_eqterr1,pl_eqterr2,st_age,st_ageerr1,st_ageerr2,st_metfe,st_metfeerr1,st_metfeerr2,st_spstr,st_ssperr,st_bj,st_bjerr,st_vj,st_vjerr,st_rc,st_rcerr,st_ic,st_icerr,st_j,st_jerr,st_h,st_herr,st_k,st_kerr,pl_discmethod,pl_ttvflag,pl_disc,rowupdate"
	}
}
