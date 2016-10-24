app.controller('demoCtrl', function($scope, $http) {
	$scope.nasaData = '';
	$scope.error = '';

	$http({
		method: 'GET',
		url: 'http://127.0.0.1:8080/api/nasaData'
	}).then(function successCallBack(res) {
		$scope.nasaData = res.data;
	}, function errorCallBack(res) {
		$scope.error = res.status + " - " + res.statusText;	
	});
});