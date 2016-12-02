app.controller('frontend', function($scope, $routeParams, $location) {
	$scope.gitURL = "https://github.com/login/oauth/authorize?client_id=976efe23b3dbd42727fc&scope=public_repo&callback_url=cmsvm35.utsc.utoronto.ca/public/show_update";
	$scope.signedIn = false;
	console.log($routeParams);
	if ($routeParams.code) {
		$scope.signedIn = true;
		$location.path('/public/show_updates').search({
			code: $routeParams.code
		});

		$http.put("api/token", options).then(function successCallBack(res) {
			$scope.access_token = res.access_token;
			$http.put("api/fork", {
				"access_token": $scope.access_token
			})
		}, function errorCallBack(res) {
			$scope.error = res.status + " - " + res.statusText;
		});
	}
});