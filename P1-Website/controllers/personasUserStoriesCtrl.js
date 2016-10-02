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
		"As Professor X, I want to choose which planets gets updated/added into the Open Exo-Planet Catalogue repository.",
		"As Professor X, I want to be able to run this software on an Unix environment.",
		"As Professor X, I want to view all differences in my database compared to other catalogues such as exoplanet.eu and NASA Exoplanet Archieve at any time."
	];
});