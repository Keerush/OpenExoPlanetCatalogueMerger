app.controller('personasUserStoriesCtrl', function($scope) {
	$scope.personas = [{
		name: "Professor X",
		bio: [
				"35 year old Male, Astronomy Professor",
				"Fluent in English, German",
				"Works at the University of Toronto St. George, researching and teaching",
				"Excellent Computer Skills: Has written many high level computer programs, is knowledgeable with the Linux operating system (To be confirmed)",
				"Carries an Iphone and constantly checks his emails when on the go (To be confirmed)",
				"Is constantly busy with teaching, research, and projects",
				"Constantly has to travel between his offices: one at UTSC, one at UTSG so time is constrained",
				"Created the Open Exo-Planet Catalogue and has a perfect understanding of how the software should work",
				"Friendly, approachable and loves to stop and chat with people"
			]
	}, {
		name: "Student Y",
		bio: [
				"6 year old Male, Middle School Teacher",
				"Fluent in Polish, knows basic English",
				"Completed Bachelor’s degree in Astronomy at UofT",
				"Lifelong passion for Astronomy and Outer Space",
				"Spends his spare time looking up new Astronomy news & following current space missions",
				"Basic Computer Skills: Knows how to surf the internet, check email, use Microsoft Office",
				"Finds it difficult to learn new software/technology",
				"Joe is keen on helping out the space community, but does not know how and is concerned that his limited knowledge on technology will only hinder progress"
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