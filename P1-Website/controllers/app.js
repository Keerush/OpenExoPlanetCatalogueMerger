var app = angular.module('mainApp', ['ngRoute']);

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
	.otherwise({ 
		redirectTo: '/' 
	});

	$locationProvider.html5Mode(true);
});