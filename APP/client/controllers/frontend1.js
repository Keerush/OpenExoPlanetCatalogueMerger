app.controller('frontend', function($scope, $routeParams, $location) {
	$scope.signedIn = false;
	
	$scope.signIn = function() {
		$scope.signedIn = true;
		console.log('htest');
	}

	console.log($routeParams);
	if ($routeParams.code) {
		$location.path('/public/show_updates').search({
			code: $routeParams.code
		});
	}
});