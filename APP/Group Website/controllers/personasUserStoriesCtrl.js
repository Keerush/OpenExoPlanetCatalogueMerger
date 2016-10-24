app.controller('personasUserStoriesCtrl', function($scope) {
	$scope.personas = [{
		name: "Professor X",
		bio: [
                "35 year old Male, Astronomy Professor",
                "Fluent in English, German",
                "Works at the University of Toronto as an assistant professor and researcher",
                "Excellent computer skills: has written many high level computer programs, comfortable with command line interfaces",
                "Frequently checks emails",
                "Is constantly busy with teaching, research, and projects",
                "Travels between his offices: one at UTSC, one at UTSG",
                "Created the Open Exo-Planet Catalogue and has perfect understanding of how the site and backend should work"
			]
	}, {
		name: "Student Y",
		bio: [
                "25 year old Female, Astronomy graduate student",
                "Fluent in English",
                "Completed Bachelor’s degree in Astronomy",
                "Good computer skills: can check emails, understands what GitHub is used for, used command line interfaces before, has very little programming experience",
                "Recently introduced to the Open Exo-Planet Catalogue. Understands basic structure of system database, but needs guidance when entering new data",
                "Generally meticulous with work but sometimes forget to double-check things when busy"

		]
	}];

	$scope.userStories = [
       "As Professor X, I want to view all differences in the Open Exo-Planet Catalogue database to exoplanet.eu and NASA Exoplanet Archive at any time, even if I had rejected previous updates.",
       "As Professor X, I want to choose which data gets updated and have them automatically be added into the Open Exo-Planet Catalogue database after I have confirmed them.",
       "As Professor X or Student Y I want to be able to login using my Github.",
       "As Professor X, I want the application to be able to omit differences caused by human typos, such as missing capitalizations in system names, misspelled system names, and any data that is determined to be an outlier.",
       "As Professor X, I want references, such as scientific publications, to be automatically added onto the generated git messages before I confirm changes to the Open Exo-Planet Catalogue database.",
       "As Professor X, I want to be able to view all differences between our database and other databases, grouped by a given planet, star, or star system in ascending or descending order, along with which catalogue the changes are coming from.",
       "As Professor X or Student Y, I want the data that the application adds to the the Open Exo-Planet Catalogue database to use the same units as the units used for pre-existing data in our database.",
       "As Professor X, I want to be able to run this webserver on an Unix environment.",
       "As Professor X, I want to be notified daily by email a summary of all the differences between the Open Exo-Planet Catalogue and both exoplanet.eu and NASA Exoplanet Archive, excluding differences that I disapproved in the past.",
       "As Professor X, I want to be able to configure automatic update checks, by frequency and time of checks.",
       "As Professor X, I want to allow other people, such as Student Y, who I have given write permissions on the Open Exo-Planet Catalogue database, to use the application to update the database.",
       "As Student Y, I want the application to provide a software wizard that guides me step-by-step on how to edit information and update the Open Exo-Planet Catalogue."
	];
});











