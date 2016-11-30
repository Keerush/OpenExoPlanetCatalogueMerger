var app = angular.module('mainApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/public', {
		templateUrl: 'public/views/frontend1.html'
	})
	.when('/public/edit_xml', {
		templateUrl: 'public/views/edit_xml.html',
	})
	.when('/public/register_email', {
		templateUrl: 'public/views/register_email.html',
	})
	.when('/public/show_updates', {
		templateUrl: 'public/views/show_updates.html',
	})
	.otherwise({ 
		redirectTo: '/public' 
	});

	$locationProvider.html5Mode(true);
});
