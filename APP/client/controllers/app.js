var app = angular.module('mainApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/public', {
		templateUrl: 'public/views/frontend1.html'
	})
	.when('/public/edit_xml', {
		templateUrl: 'public/views/edit_xml.html',
		controller: 'edit_xml'
	})
	.when('/public/edit_xml_eu', {
		templateUrl: 'public/views/edit_xml_eu.html',
		controller: 'edit_xml'
	})
	.when('/public/register_email', {
		templateUrl: 'public/views/register_email.html',
		controller: 'register_email'
	})
	.when('/public/show_updates', {
		templateUrl: 'public/views/show_updates.html',
		controller: 'show_updates'
	})
	.otherwise({
		redirectTo: '/public'
	});

	$locationProvider.html5Mode(true);
});
