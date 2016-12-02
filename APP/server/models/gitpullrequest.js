var config = require('../../config.js');
var exec = require('child_process').exec;
var request = require('request-promise');
var git = require('simple-git')(config.forkedRepoLocation);
var winston = require('winston');

const fs = require('fs')
var S = require('string');

module.exports = {
	generatePullRequest: function(database, token) {
		token = "044977754f2e14d05536dec207a231e502d1a6dc"
		git.diffSummary(function(error, result) {
			var string = "There are differences between " + database + " and the open-exoplanet catalogue in the files"
			var index
			for (index in result.files) {

				string += " " + S(result.files[index].file).between('/', '.xml') + ","
			}
			string = S(string).stripRight(',').s
			winston.log('info',string)

			git.add('./', function(error, result) {
				winston.log('info',result)
				git.commit(string, function(error, result) {
					winston.log('error',"Commit error: ", error)
					winston.log('info',"Commit result: ", result)
					git.push("origin", "master", function(error, result) {
						var options = {
							url: "https://api.github.com/user",
							headers: {
								json: true,
								'User-Agent': "openexoplanetmerger",
								'Authorization': 'token ' + token
							},
							transform: function(body, response, resolveWithFullResponse) {
								return response;
							}
						}
						return request.get(options)
							.then(function(response) {
								var body = JSON.parse(response.body)
								var prOptions = {
									json: true,
									url: "https://api.github.com/repos/Keerush/open_exoplanet_catalogue/pulls",
									headers: {
										'User-Agent': "openexoplanetmerger",
										'Authorization': 'token ' + token
									},
									body: {
										"title": "Differences between " + database + " and the open-exoplanet catalogue!",
										"head": body["login"]+":master",
										"base": "master",
										"body": "please take a look at these changes our automated system has found between the open-exoplanet catalogue and " + database
									}
								}
								return request.post(prOptions);

							})
					})
				})
			})
		})

	}
}
