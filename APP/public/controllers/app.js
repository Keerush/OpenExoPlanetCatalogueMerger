var app = angular.module('mainApp', ['ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/homepage.html'
	})
	.when('/about_us', {
		templateUrl: 'views/about_us.html'
	})
	.when('/about_members', {
		templateUrl: 'views/about_members.html',
		controller: 'aboutMembersCtrl'
	})
	.when('/team_agreement', {
		templateUrl: 'views/team_agreement.html'
	})
	.when('/personas_user-stories', {
		templateUrl: 'views/personas_user-stories.html',
		controller: 'personasUserStoriesCtrl'
	})
	.when('/deliverable3', {
		templateUrl: 'views/deliverable3.html',
		controller: 'deliverable3-part1Ctrl'
	})
	.when('/demo', {
		templateUrl: 'views/demo.html',
		controller: 'demoCtrl'
	})
	.otherwise({ 
		redirectTo: '/' 
	});

	$locationProvider.html5Mode(true);
});