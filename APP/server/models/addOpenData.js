var config = require('../../config.js')
var git = require('simple-git');
var mysql = require('promise-mysql');
var fs = require('fs');
var Q = require('q');
var parser = require('xml2json');

// Add to a config file.
var repoLoc = 'https://github.com/OpenExoplanetCatalogue/open_exoplanet_catalogue.git';
var folderPath = '/repos/master/';
var localLoc = config.directory + folderPath;

function findByKey(currObj, searchKey) {
    var result = [];
    if (currObj instanceof Array) {
        for (var i = 0; i < currObj.length; i++) {
            var temp = findByKey(currObj[i], searchKey);
            if (typeof temp !== 'undefined' && temp.length > 0) {
                result = result.concat(temp);
            }
        }
    } else {
        for (var currKey in currObj) {
            if (currKey == searchKey) {
                result = result.concat(currObj[currKey]);
            }
            if (currObj[currKey] instanceof Object || currObj[currKey] instanceof Array)
                var temp = findByKey(currObj[currKey], searchKey);
            if (typeof temp !== 'undefined' && temp.length > 0) {
                result = result.concat(temp);
            }
        }
    }
    return result;
};

function getValue(obj) {
    if (obj instanceof Object) {
        return obj['$t'];
    }
    return obj;
};

function getPlus(obj) {
    if (obj instanceof Object) {
        return obj.errorplus;
    }
    return null;
};

function getMinus(obj) {
    if (obj instanceof Object) {
        return obj.errorminus;
    }
    return null;
};

function getNames(obj) {
    var origName = '';
    var namesInput = [];

    if (obj.name instanceof Array) {
        origName = obj.name[0];
        obj.name.forEach(function(name) {
            namesInput.push([name, origName]);
        });
    } else {
        origName = obj.name;
        namesInput.push([origName, origName]);
    }

    return [origName, namesInput];
}

function getMassValue(obj, type) {
    if (obj instanceof Object) {
        if ((type == 'msini' && obj.type == 'msini') || (type == 'jupiter' && obj.type != 'msini')) {
            return obj['$t'];
        }
    }
    return null;
}


function getMassPlus(obj, type) {
    if (obj instanceof Object) {
        if ((type == 'msini' && obj.type == 'msini') || (type == 'jupiter' && obj.type != 'msini')) {
            return obj.errorplus;
        }
    }
    return null;
}

function getMassMinus(obj, type) {
    if (obj instanceof Object) {
        if ((type == 'msini' && obj.type == 'msini') || (type == 'jupiter' && obj.type != 'msini')) {
            return obj.errorminus;
        }
    }
    return null;
}

function getSeperation(obj, unit) {
    if (obj instanceof Array) {
        obj.forEach(function(item) {
            if (item.unit == unit) {
                return item;
            }
        });
    }
    return obj;
}

module.exports = () => {
    var promise = new Promise(function(resolve, reject) {

        var pool = mysql.createPool({
            host: config.mysql.host,
            user: config.mysql.username,
            password: config.mysql.password,
            database: config.mysql.database
        });

        // clone the exoplanet repo.
        console.log('localloc is ', localLoc);
        //needs to be rewritten, this is asychronous so lines 151 is run first, throwing an error

        fs.readdir(localLoc, fs.F_OK, function(err, files) {
            console.log("here");
            if (err && err.code === 'ENOENT') {
                console.log("directory doesn't exist!");
                fs.mkdirSync(localLoc);
                err = false;
            }
            console.log(files);
            if (!err) {
                var func;

                git().cwd(localLoc);
                if (files && files.length) {
                    console.log("checkout")
                    func = git().checkout("master");
                } else {
                    func = git().clone(repoLoc, localLoc);
                    console.log("cloning into ", localLoc);
                }

                func
                    .then(function(err) {
                        console.log('Pulling open exoplanet repo completed.');
                        var planetInput = [],
                            starInput = [],
                            namesInput = [],
                            planetStarInput = [],
                            systemInput = [],
                            starSystemInput = [];

                        var planetQuery = 'INSERT IGNORE INTO OpenPlanet (name, semimajoraxis, semimajoraxisminus, semimajoraxisplus, separationarcsec, separationarcsecminus,  separationarcsecplus, separationau, separationauminus, separationauplus, eccentricity, eccentricityminus, eccentricityplus, periastron, periastronminus, periastronplus, longitude, longitudeminus, longitudeplus, meananomaly, meananomalyminus, meananomalyplus, ascendingnode, ascendingnodeminus, ascendingnodeplus, inclination, inclinationminus, inclinationplus, impactparameter, impactparameterminus, impactparameterplus, period, periodminus, periodplus, transittime, transittimeminus, transittimeplus, periastrontime, periastrontimeminus, periastrontimeplus, maximumrvtime, maximumrvtimeminus, maximumrvtimeplus, massjupiter, massjupiterminus, massjupiterplus, massmsini, massmsiniminus, massmsiniplus, radius, radiusminus, radiusplus, temperature, temperatureminus, temperatureplus, age, ageminus, ageplus, spectraltype, spectraltypeminus, spectraltypeplus, magB, magBminus, magBplus, magV, magVminus, magVplus, magR, magRminus, magRplus, magI, magIminus, magIplus, magJ, magJminus, magJplus, magH, magHminus, magHplus, magK, magKminus, magKplus, discoverymethod, istransiting, description, discoveryyear, lastupdate, spinorbitalignment, spinorbitalignmentminus, spinorbitalignmentplus, fileName) VALUES ?',
                            starQuery = 'INSERT IGNORE INTO OpenStar (name, mass, massplus, massminus, radius, radiusplus, radiusminus, temperature, temperatureplus, temperatureminus, age, ageplus, ageminus, metallicity, metallicityplus, metallicityminus, spectraltype, magB, magBplus, magBminus, magV, magVplus, magVminus, magR, magRplus, magRminus, magI, magIplus, magIminus, magJ, magJplus, magJminus, magH, magHplus, magHminus, magK, magKplus, magKminus, fileName) VALUES ?',
                            nameQuery = 'INSERT IGNORE INTO OpenNames (name, otherName) VALUES ?',
                            planetStarQuery = 'INSERT IGNORE INTO OpenPlanetStar (planetName, starName) VALUES ?',
                            systemQuery = 'INSERT IGNORE INTO OpenSystem (name, declination, rightascension, distance, distanceminus, distanceplus, videolink, fileName) VALUES ?',
                            starSystemQuery = 'INSERT IGNORE INTO OpenStarSystem (starName, systemName) VALUES ?';

                        // Go through all files in open exoplanet dir.
                        localLoc = localLoc + "systems/";
                        fs.readdirSync(localLoc).forEach(function(file) {
                            if (file.startsWith(".")) {
                                console.log('starts with .');
                                return;
                            }
                            var fileR = localLoc + file;
                            var data = fs.readFileSync(fileR);

                            var info = JSON.parse(parser.toJson(data));

                            // parse planet data ----------------------
                            var planets = findByKey(info.system, 'planet');
                            planets.forEach(function(planet) {
                                // get list of other names
                                var planetNames = getNames(planet),
                                    planetName = planetNames[0];
                                namesInput = namesInput.concat(planetNames[1]);

                                planetInput.push([planetName, getValue(planet.semimajoraxis), getMinus(planet.semimajoraxis), getPlus(planet.semimajoraxis), getValue(getSeperation(planet.separation, 'arcsec')), getMinus(getSeperation(planet.separation, 'arcsec')), getPlus(getSeperation(planet.separation, 'arcsec')), getValue(getSeperation(planet.separation, 'AU')), getMinus(getSeperation(planet.separation, 'AU')), getPlus(getSeperation(planet.separation, 'AU')), getValue(planet.eccentricity), getMinus(planet.eccentricity), getPlus(planet.eccentricity), getValue(planet.periastron), getMinus(planet.periastron), getPlus(planet.periastron), getValue(planet.longitude), getMinus(planet.longitude), getPlus(planet.longitude), getValue(planet.meananomaly), getMinus(planet.meananomaly), getPlus(planet.meananomaly), getValue(planet.ascendingnode), getMinus(planet.ascendingnode), getPlus(planet.ascendingnode), getValue(planet.inclination), getMinus(planet.inclination), getPlus(planet.inclination), getValue(planet.impactparameter), getMinus(planet.impactparameter), getPlus(planet.impactparameter), getValue(planet.period), getMinus(planet.period), getPlus(planet.period), getValue(planet.transittime), getMinus(planet.transittime), getPlus(planet.transittime), getValue(planet.periastrontime), getMinus(planet.periastrontime), getPlus(planet.periastrontime), getValue(planet.maximumrvtime), getMinus(planet.maximumrvtime), getPlus(planet.maximumrvtime), getMassValue(planet.mass, 'jupiter'), getMassMinus(planet.mass, 'jupiter'), getMassPlus(planet.mass, 'jupiter'), getMassValue(planet.mass, 'msini'), getMassMinus(planet.mass, 'msini'), getMassPlus(planet.mass, 'msini'), getValue(planet.radius), getMinus(planet.radius), getPlus(planet.radius), getValue(planet.temperature), getMinus(planet.temperature), getPlus(planet.temperature), getValue(planet.age), getMinus(planet.age), getPlus(planet.age), getValue(planet.spectraltype), getMinus(planet.spectraltype), getPlus(planet.spectraltype), getValue(planet.magB), getMinus(planet.magB), getPlus(planet.magB), getValue(planet.magV), getMinus(planet.magV), getPlus(planet.magV), getValue(planet.magR), getMinus(planet.magR), getPlus(planet.magR), getValue(planet.magI), getMinus(planet.magI), getPlus(planet.magI), getValue(planet.magJ), getMinus(planet.magJ), getPlus(planet.magJ), getValue(planet.magH), getMinus(planet.magH), getPlus(planet.magH), getValue(planet.magK), getMinus(planet.magK), getPlus(planet.magK), planet.discoverymethod, planet.istransiting, planet.description, planet.discoveryyear, planet.lastupdate, getValue(planet.spinorbitalignment), getMinus(planet.spinorbitalignment), getPlus(planet.spinorbitalignment), file]);
                            });

                            // parse star data ------------------------
                            var stars = findByKey(info.system, 'star');
                            stars.forEach(function(star) {
                                // get list of other names
                                var starNames = getNames(star),
                                    starName = starNames[0];
                                namesInput = namesInput.concat(starNames[1]);

                                // get star info
                                starInput.push([starName, getValue(star.mass), getPlus(star.mass), getMinus(star.mass), getValue(star.radius), getPlus(star.radius), getMinus(star.radius), getValue(star.temperature), getPlus(star.temperature), getMinus(star.temperature), getValue(star.age), getPlus(star.age), getMinus(star.age), getValue(star.metallicity), getPlus(star.metallicity), getMinus(star.metallicity), star.spectraltype, getValue(star.magB), getPlus(star.magB), getMinus(star.magB), getValue(star.magV), getPlus(star.magV), getMinus(star.magV), getValue(star.magR), getPlus(star.magR), getMinus(star.magR), getValue(star.magI), getPlus(star.magI), getMinus(star.magI), getValue(star.magJ), getPlus(star.magJ), getMinus(star.magJ), getValue(star.magH), getPlus(star.magH), getMinus(star.magH), getValue(star.magK), getPlus(star.magK), getMinus(star.magK), file]);

                                // planets of the star
                                if (!!star.planet) {
                                    if (star.planet instanceof Array) {
                                        star.planet.forEach(function(planet) {
                                            planetStarInput.push([getNames(planet)[0], starName]);
                                        });
                                    } else {
                                        planetStarInput.push([getNames(star.planet)[0], starName]);
                                    }
                                }
                            });

                            //parse system data ----------------------
                            var system = info.system;
                            var systemNames = getNames(system),
                                systemName = systemNames[0];
                            namesInput = namesInput.concat(systemNames[1]);

                            // get system info
                            systemInput.push([systemName, system.declination, system.rightascension, getValue(system.distance), getMinus(system.distance), getPlus(system.distance), system.videolink, file]);

                            // stars of the system
                            if (!!system.star) {
                                if (system.star instanceof Array) {
                                    system.star.forEach(function(star) {
                                        starSystemInput.push([getNames(star)[0], systemName]);
                                    });
                                } else {
                                    starSystemInput.push([getNames(system.star)[0], systemName]);
                                }
                            }
                        });
                        console.log('read all files');

                        var queries = [
                                [planetQuery, planetInput],
                                [starQuery, starInput],
                                [nameQuery, namesInput],
                                [planetStarQuery, planetStarInput],
                                [systemQuery, systemInput],
                                [starSystemQuery, starSystemInput]
                            ],
                            promises = [];

                        queries.forEach(function(item, index) {
                            var promise = pool.getConnection()
                                .then(function(conn) {
                                    return conn.query(item[0], [item[1]])
                                        .then(function(res) {
                                            console.log('Performed ' + item[0].substring(0, item[0].indexOf('(')));
                                            pool.releaseConnection(conn);
                                        }).catch(function(err) {
                                            console.log('Could not ' + item[0].substring(0, item[0].indexOf('(')));
                                            console.log(err);
                                            pool.releaseConnection(conn);
                                        });
                                });
                            promises.push(promise);
                        });

                        Q.all(promises).then(function(data) {
                            console.log('ending pool');
                            pool.end();
                        }).catch(function(err) {
                            console.log("error somewhere");
                            console.log(err);
                            pool.end();
                        });
                    });
            } else {
                console.log(err);
                console.log('else branch');
            }
        });
    });
    return promise;
};