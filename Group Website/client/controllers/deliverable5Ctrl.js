
app.controller('deliverable5Ctrl', function($scope) {
	$scope.codeReviews = [{
		reviewerName: "Keerysanth Sribaskaran",
		codeName: "createTables.js",
		codeLink: "https://github.com/CSCC01-Fall2016/team20-Project/blob/master/APP/server/models/createTables.js",
		author: "Kent Chow, Keerysanth Sribaskaran",
		dateOfReview: "Thursday, December 1, 2016",
		bugs: "All bugs have been fixed since the last code check.",
		poorCodeLogic: "None",
		poorCodeStyle: "None, declaring the variables for the database was styled well to make it easy to read [Line 37-129]",
		missingDocumentation: "No documentation, large functions Promise need to have commenting to understand what is going on. [Line 37-129]",
		unreadableCode: "Nothing else, apart from the code mentioned above in missing documentation.",
		vulnerabilities: "None",
		poorTesting: "There is 1 test, needs more thorough testing."
	}, {
		reviewerName: "Brandon Ramoudith",
		codeName: "show_updates.html",
		codeLink: "https://github.com/CSCC01-Fall2016/team20-Project/blob/master/APP/client/views/show_updates.html",
		author: "Simon",
		dateOfReview: "Thursday, December 1, 2016.",
		bugs: "None",
		poorCodeLogic: "None",
		poorCodeStyle: "Not all of the <div> tags are indented properly, Should have external stylesheet",
		missingDocumentation: "Missing documentation for all of the code. In general no comments at all.",
		unreadableCode: "The poor indenting makes it hard to see what content is contained in certain div tags. The code is messy.",
		vulnerabilities: "None",
		poorTesting: "There are no test cases. Local tests were performed which ran perfectly."
	}, {
		reviewerName: "Simon Wong",
		codeName: "getUnderReview.js",
		codeLink: "https://github.com/CSCC01-Fall2016/team20-Project/blob/master/APP/server/models/getUnderReview.js",
		author: "Keerush",
		dateOfReview: "Thursday, December 1, 2016",
		bugs: "When tested locally, the code worked and returned the expected output.",
		poorCodeLogic: "None. The code seems efficient will little redundancy",
		poorCodeStyle: "Parts of the code were commented because it might not be implemented. If we know for sure it won't be used, it should be deleted to make the code look cleaner. Otherwise the code is indented properly & easy to read. Some bad variable name declarations such as 'promise' vs. 'promises' [Line 30, 31]",
		missingDocumentation: "There are some comments explaining what functions do.",
		unreadableCode: "The Queries in line 87, 91, 95 could split into multiple lines to make it easier to read. ",
		vulnerabilities: "None, the login credentials are stored in an external file which are not made public on github.",
		poorTesting: "Needs formal testing"
	}, {
		reviewerName: "Kent Chow",
		codeName: "addOpenData.js",
		codeLink: "https://github.com/CSCC01-Fall2016/team20-Project/blob/master/APP/server/models/addOpenData.js",
		author: "Keerush",
		dateOfReview: "Thursday, December 1, 2016",
		bugs: "None",
		poorCodeLogic: "None",
		poorCodeStyle: "Server data should be stored separate instead of hardcoded.",
		missingDocumentation: "Next to no commenting, needs more.",
		unreadableCode: "None, the code is indented and styled properly, easy to read.",
		vulnerabilities: "None",
		poorTesting: "No tests"
	}];

	$scope.systemDesign = {
		image: 'images/system_design_revised.png',
		description: [
			'The front end of our system consists of setAutoUpdate, manualUpdate, admin, viewDifferences, and editXml pages. The setAutoupdate page will allow the user to store and email for notifications and set a time period of when to check for data using the scripts found in the backend. The manual update is similar to the previously mentioned page but it allows the user to start the update process and push change to the open planet repo. The admin page is used to clean up data in the database by dropping the tables, and creating them. This will generally be used for new databases or if an old database is getting removed. The view differences page is used to view the differences that have been found from either the manual update or the automated update. This gives the user the ability to view ,modify and delete these changes, before they are pushed to the open exoplanet repository.',
			'The back end of our system consists of addNasaData, addEuData, addOpenData, createTables, dropTables, and compareDB scripts. The addNasaData, addEuData, and addOpenData inserts the data from Nasa archive, exoplanet.eu, and Open exoplanet respectively. Create and drop tables creates and deletes the tables that are needed to store to above data. The compareDB script contains the methods that deal with finding differences between the other databases and open exoplanet repository and pushing the changes to the repository afterwards. The front end communicates to the back end of our system through api calls, as well as the backend with the database.'
		]
	};

	$scope.systemValidationDesc = [
		'Our system validation was to run tests to verify if our apis in the back-end worked as intended, so that we knew our user interface would receive the data it needed for each request. The evidence for this is found in our tests folder in APP.',
		'Another system validation we performed was to manually perform the tasks as the client Hano, so that we could see if the user interface worked as intended and the steps for the user were minimal. We also manually tested the outputs of the backend methods to verify that the errors and outputs were human-readable. These manual tests were done by each member and evidence of this is from the code review reports handed in for deliverable 4.'
	];

	$scope.groupVid = 'https://www.youtube.com/watch?v=EYX8G1A-Gr0';

	$scope.systemDesign = {
		image: 'images/d5_images/system_design.png',
		description: [
		'The front end of our system consists of frontpage, show_updates, and edit_xml pages. The setAutoupdate page would have allowed the user to store and email for notifications and set a time period of when to check for data using the scripts found in the backend. The manual update would have been similar to the previously mentioned page but it allows the user to start the update process and push change to the open planet repo. The admin page is used to clean up data in the database by dropping the tables, and creating them. This will generally be used for new databases or if an old database is getting removed. The show_updates page is used to view the differences that have been found from either the manual update or the automated update. This gives the user the ability to view, modify and delete these changes, before they are pushed to the open exoplanet repository.',
		'The back end of our system consists of addNasaData, addEuData, addOpenData, createTables, dropTables, editXMLFile, git and getUnderReview scripts. The addNasaData, addEuData, and addOpenData inserts the data from Nasa archive, exoplanet.eu, and Open exoplanet respectively, and pushing the changes between themselves to the under review table. Create and drop tables creates and deletes the tables that are needed to store to above data. The getUnderReview script contains the methods that deal with getting the differences in the underreview table and returning a json format to the frontend to display. The editXMLFile.js takes the finalize outputs of differences from the user and edits the corresponding files. The git script contains methods that fork the OEC repository so that the editXMLFile script can edit them as well as creating pull requests of the finalized differences. The front end communicates to the back end of our system through api calls, as well as the backend with the database and github.'
		]
	};

	$scope.systemValidationDesc = [
		'Our system validation was to run tests to verify if our apis in the back-end worked as intended, so that we knew our user interface would receive the data it needed for each request. The evidence for this is found in our tests folder in APP.',
		'Another system validation we performed was to manually perform the tasks as the client Hano, so that we could see if the user interface worked as intended and the steps for the user were minimal. We also manually tested the outputs of the backend methods to verify that the errors and outputs were human-readable. These manual tests were done by each member and evidence of this is from the code review reports handed in for deliverable 5.'
	];

	$scope.groupVid = 'https://youtu.be/9eBmIvP3UzU';
});
