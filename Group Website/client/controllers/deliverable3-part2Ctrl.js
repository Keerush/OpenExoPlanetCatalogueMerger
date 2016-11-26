app.controller('deliverable3-part2Ctrl', function($scope) {
	$scope.questions = [{
		question: "What tools, if any, will you use for your task board?",
		answer: ["Zenhub"]
	},{
		question: "What tools, if any, will you use for your burn-down chart?",
		answer: ["Zenhub"]
	},{
		question: "Who will maintain the burn-down chart? How?",
		answer: ["Chelina will maintain the burn-down chart by organizing daily scrum meetings. During such meetings, she will log the hours we have completed or any tasks we have began/finished. Afterwards she will input the logs into the burn-down chart, in which Zenhub will automatically update the burn-down chart for us."]
	},{
		question: "What is every team member’s role?",
		answer: [
			"Chelina: Software Developer / Burn-down chart updater",
			"Brandon: Software Developer / Master branch maintainer",
			"Kent: Software Developer / Proofreader",
			"Keerush: Software Developer / Front End Developer",
			"Simon: Software Developer / Communicator (Reminds teams of meetings, deadlines)"
		]
	},{
		question: "What tools, if any, will you use for communication?",
		answer: [
			"We have been using Slack to communicate within our group. It is ideal because we can share ideas with the group, as well as any subgroups we may form. For many of the documents we have created, we have organized it through Google Docs which lets collaborate online as well as share any comments we have. ",
			"To communicate with our T.A, we have also set up a slack line."
		]
	},{
		question: "When do you plan to meet in person?",
		answer: [
			"We plan to meet three times a week:",
			"Monday to track the progress of our tasks over the weekend",
			"Wednesday to make sure we all are on the same page before our interview with the T.A",
			"Friday after the tutorial to set new goals for the weekend."
		]
	},{
		question: "How will you use your repository on GitHub?",
		answer: ["We will use GitHub for the purpose it was designed for. Whenever a member makes any changes, he/she will push the changes to the repository and then make an announcement on slack so that everyone is immediately aware of any new changes that have been made."]
	},{
		question: "Which machines will be used for development by each team member? E.g., the lab machine, a Linux laptop, a Windows home computer, etc.",
		answer: ["Lab Machines, Macbooks, Windows laptops"]
	}];
});