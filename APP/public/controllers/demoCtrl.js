app.controller('demoCtrl', function($scope, $http) {
	$scope.nasaData = '';
	$scope.error = '';

	$http({
		method: 'GET',
		url: '/api'
	}).then(function successCallBack(res) {
		$scope.nasaData = res.data;
	}, function errorCallBack(res) {
		$scope.error = res.status + " - " + res.statusText;	
	});
});