var app = angular.module('mainApp', ['ngRoute', 'ui.bootstrap', 'ngYoutubeEmbed']);

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
		.when('/deliverable3part1', {
			templateUrl: 'views/deliverable3part1.html',
			controller: 'deliverable3-part1Ctrl'
		})
		.when('/deliverable3part2', {
			templateUrl: 'views/deliverable3part2.html',
			controller: 'deliverable3-part2Ctrl'
		})
		.when('/deliverable4', {
			templateUrl: 'views/deliverable4.html',
			controller: 'deliverable4Ctrl'
		})
		.when('/demo', {
			templateUrl: 'views/demo.html',
			controller: 'demoCtrl'
		})
		.when('/deliverable5', {
			templateUrl: 'views/deliverable5.html',
			controller: 'deliverable5Ctrl'
		})
		.otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(true);
});