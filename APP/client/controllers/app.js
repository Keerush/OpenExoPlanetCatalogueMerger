var app = angular.module('mainApp', ['ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/frontend1.html',
	})
	.when('/edit_xml', {
		templateUrl: 'views/edit_xml.html',
	})
	.when('/register_email', {
		templateUrl: 'views/register_email.html',
	})
	.when('/show_updates', {
		templateUrl: 'views/show_updates.html',
	})
	.otherwise({ 
		redirectTo: '/' 
	});

	$locationProvider.html5Mode(true);
});
