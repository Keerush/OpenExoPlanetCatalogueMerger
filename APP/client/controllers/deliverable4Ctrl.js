app.controller('deliverable4Ctrl', function($scope) {
	$scope.codeReviews = [{
		reviewerName: "Keerysanth Sribaskaran",
		codeName: "createTables.js",
		codeLink: "https://github.com/CSCC01-Fall2016/team20-Project/blob/master/APP/server/models/createTables.js",
		author: "Kent Chow, Keerysanth Sribaskaran",
		dateOfReview: "Wednesday, November 9, 2016",
		bugs: "Returns error for existing tables. We should check that the tables exist before adding them.",
		poorCodeLogic: "We should store server information into some sort of config file so that we can access it in our other scripts.",
		poorCodeStyle: "Should not perform string manipulation on query. Using ‘?’ for the values and then stating the value as a list of inputs will be safer.",
		missingDocumentation: "No documentation found in file. The query function needs to be documented since it can get tricky to read and understand.",
		unreadableCode: "Nothing else, apart from the code mentioned above in missing documentation.",
		vulnerabilities: "Error values are not checked for, when using promises with the database queries that create and drop the tables.",
		poorTesting: "No tests written for any functions."
	}, {
		reviewerName: "Brandon Ramoudith",
		codeName: "addNasaData.js",
		codeLink: "https://github.com/CSCC01-Fall2016/team20-Project/commit/cf62249265b6c0cb7e034af2fdb15b233c423904",
		author: "Keerush",
		dateOfReview: "Saturday, November 12, 2016.",
		bugs: "None.",
		poorCodeLogic: "In line 15, it’s better to get a library that will wrap the database pooling into a promise, as opposed to manually doing it this way.\nIn line 39, Using string manipulations on the object is very inefficient, the mysql driver can take objects as an input and is designed as such.",
		poorCodeStyle: "Bad naming for lines 39-45.",
		missingDocumentation: "Missing documentation for all of the code. In general no comments at all.",
		unreadableCode: "None.",
		vulnerabilities: "In line 6, Password / Names / Database URLs are hardcoded as opposed to using variables.\nIn lines 58-63, manually inserting strings instead of using a variable allows for SQL injection.",
		poorTesting: "There are no tests."
	}, {
		reviewerName: "Simon Wong",
		codeName: "dropTables.js",
		codeLink: "https://github.com/CSCC01-Fall2016/team20-Project/blob/master/APP/server/models/dropTables.js",
		author: "Keerush",
		dateOfReview: "Sunday, November 13, 2016",
		bugs: "None that I could find, the code works fine",
		poorCodeLogic: "None.",
		poorCodeStyle: "The username and password are hard coded into the script. They should be stored in a separate text file for security purposes and read/accessed from dropTables.\nSome of the variable names are too similar to each other such as Promises (Line 17) and Promise (Line 18). This increases the chance of accidentally writing the incorrect variable name as they are so similar.",
		missingDocumentation: "The main function (Line 47 – 68) could use a little bit of commenting to explain quickly its purpose. Though the function is quite self-explanatory.",
		unreadableCode: "Some of the variables could have been done in one line such as Sources (Line 22- 26),creating lots of unnecessary white space",
		vulnerabilities: "As mentioned earlier, hard coding the database login information is a serious security issue. The login credentials should be placed in a textfile and read in.",
		poorTesting: "Could be more thorough with testing, currently there is only 1 test."
	}, {
		reviewerName: "",
		codeName: "",
		codeLink: "",
		author: "",
		dateOfReview: "",
		bugs: "",
		poorCodeLogic: "",
		poorCodeStyle: "",
		missingDocumentation: "",
		unreadableCode: "",
		vulnerabilities: "",
		poorTesting: ""
	}];
});