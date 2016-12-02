app.controller('register_email', function($scope, $http) {

  $scope.loginInfo = {};
  $scope.registerEmail = function() {
    console.log($scope.loginInfo);

    $http.post('/api/email', $scope.loginInfo).success(function(data) {
      console.log('Success')
    }).error(function(data) {
      console.log('Error')
    });
  }
});
