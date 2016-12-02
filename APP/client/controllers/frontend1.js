app.controller('frontend', function($scope, $routeParams, $location) {
  console.log($routeParams);
  if ($routeParams.code) {
    $location.path('/public/show_updates').search({code: $routeParams.code});
	}
  }
);

