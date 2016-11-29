var config = require('../../config.js');
var exec = require('child_process').exec;
var request = require('request-promise');
var git = require('simple-git');
var winston = require('winston');
winston.add(winston.transports.File, {
	filename: config.logLocation
})
winston.remove(winston.transports.Console);
const fs = require('fs')


module.exports = {
	pushDifferences: function(token, username) {
		var testtoken = "044977754f2e14d05536dec207a231e502d1a6dc"

		var options = {
			url: "https://api.github.com/user",
			headers: {
				json: true,
				'User-Agent': "openexoplanetmerger",
				'Authorization': 'token 044977754f2e14d05536dec207a231e502d1a6dc'
			},
			transform: function(body, response, resolveWithFullResponse) {
				return response;
			}
		}
		return request.get(options)
			.then(function(response) {
				console.log('we got here')
				if (response.statusCode === 200 && response.statusMessage === "OK") {
					var body = JSON.parse(response.body)
					if (body["login"] != username) {
						console.log("unauthorized access! we don't know who you are")
						winston.log('error', "unauthorized access... something's fishy!!");
						throw "unauthorized access"
					}
					winston.log('info', "We're authenticated and ready to go!")

					var getOptions = {
						url: "https://api.github.com/user/repos",
						headers: {
							'User-Agent': "openexoplanetmerger",
							'Authorization': 'token 044977754f2e14d05536dec207a231e502d1a6dc'
						}
					};

					return request.get(getOptions).then(function(response) {
						console.log("now here")
						var item
						var repoExists = false
						for (item in response) {
							if (item.name == "open_exoplanet_catalogue" && item.fork) {
								repoExists = true
								break
							}
						}
						console.log(repoExists)
						return repoExists
					})


				}
				throw "response is wrong";
				//console.log("res is ", res);
			}) //delete
			.then(function(repoExists) {
				if (repoExists) {
					console.log(repoExists)
					var deleteOptions = {
						url: "https://api.github.com/repos/" + username + "/open_exoplanet_catalogue",
						headers: {
							'User-Agent': "openexoplanetmerger",
							'Authorization': 'token 044977754f2e14d05536dec207a231e502d1a6dc'
						}
					};
					return request.delete(deleteOptions)
				}
				console.log("here");
				return
			})
			//fork here
			.then(function(deleted) {
				var forkOptions = {
					json: true,
					url: "https://api.github.com/repos/OpenExoplanetCatalogue/open_exoplanet_catalogue/forks",
					headers: {
						'User-Agent': "openexoplanetmerger",
						'Authorization': 'token 044977754f2e14d05536dec207a231e502d1a6dc'
					}
				}
				return request.post(forkOptions);
			})
			.then(function(resp) {
				winston.log('info', "done forking")
				winston.log('info',resp);
				var gitlocation = resp.git_url
					//SOME DUMBASS WILL CHANGE THIS TO / AND SCREW THEIR COMPUTER SO WE HAVE TO OBFUSCATE

				if (config.forkedRepoLocation === "/") {
					winston.log("error", "some idiot changed the repo location to root!!")
					console.log("YOU HAVE MESSED SOMETHING UP AND ARE GOING TO DELETE EVERYTHING!!!")
					return;
				} else {
					// FURTHER CHECKIGN TO MAKE SURE WE DON'T DELETE ANYTHING IMPORTANT NOT ASYNC
					var files = fs.readdirSync("/")

					files.forEach(file => {
						if (config.forkedRepoLocation == "/" + file) {
							console.log("YOU HAVE MESSED SOMETHING UP AND ARE GOING TO DELETE EVERYTHING!!!")
							console.log("YOU HAVE MESSED SOMETHING UP AND ARE GOING TO DELETE EVERYTHING!!!")
							console.log("YOU HAVE MESSED SOMETHING UP AND ARE GOING TO DELETE EVERYTHING!!!")
							return;
						}
					})

					exec('rm -rf ' + config.forkedRepoLocation, function(err, stdout, stderr) {
						console.log("deleted the (previous) forked repo (if it existed)");
						if (err) {
							winston.log('error', "Error deleting the forked repo", err);
							return;
						}


					})

					git().clone(gitlocation, config.forkedRepoLocation)


				}

			})
			.catch(function(error) {
				console.log("there is an error");
				winston.log('error', "there is an error, ", error)
			})
	}

}