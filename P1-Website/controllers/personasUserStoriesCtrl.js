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
       "As Professor X, I want to choose which data gets updated and have them automatically be added into the Open Exo-Planet Catalogue database after I have confirmed them.",
       "As Professor X, I want to be able to run this software on an Unix environment.",
       "As Professor X, I want to view all differences in the Open Exo-Planet Catalogue database to other catalogues such as exoplanet.eu and NASA Exoplanet Archieve at any time, even if I had rejected previous updates.",
       "As Professor X, I want to be notified daily by email of any new changes in the Open Exo-Planet Catalogue compared to other catalogues.",
       "As Professor X, I want the application to be able to accurately compare databases even if there are human typos in other catalogues.",
       "As Professor X or Student Y I want to be able to login using my Github.",
       "As Student Y, I want the system to guide me when editing new information, and updating the Open Exo-Planet Catalogue.",
       "As Professor X, I want to give this application to other people who have write permissions on the Open Exo-Planet Catalogue database, such as Student Y.",
       "As Professor X, I want to be able to configure automatic update checks, by frequency and time of checks.",
       "As Professor X, I want to be able to view catalogue differences sorted alphabetically by planet, star, or star system names in either ascending or descending order.",
       "As Professor X, I want to be able to view catalogue differences in a given planet, star, or star system, along with which catalogue the changes are coming from.",
       "As Professor X, I want references to be automatically added onto the generated git messages before I confirm changes to the Open Exo-Planet Catalogue database.",
       "As Professor X or Student Y, I want to be able to set standard units for the data being added or updated into the the Open Exo-Planet Catalogue database from other catalogues."
	];
});