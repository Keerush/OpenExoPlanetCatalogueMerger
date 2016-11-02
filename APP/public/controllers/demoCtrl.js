app.controller('demoCtrl', function($scope, $http) {
	$scope.nasaData = '';
	$scope.euData = '';
	$scope.error = '';
	$scope.isNASADisabled = false;
	$scope.isEUDisabled = false;

	$scope.getNasaData = function(){
		$scope.isNASADisabled = true;
		$http({
			method: 'GET',
			url: '/nasaData'
		}).then(function successCallBack(res) {
			$scope.nasaData = res.data;
		}, function errorCallBack(res) {
			$scope.error = res.status + " - " + res.statusText;	
		});
	}

	$scope.getEUData = function(){
		$scope.isEUDisabled = true;
		$http({
			method: 'GET',
			url: '/euData'
		}).then(function successCallBack(res) {
			$scope.euData = res.data;
		}, function errorCallBack(res) {
			$scope.error = res.status + " - " + res.statusText;	
		});
	}
});