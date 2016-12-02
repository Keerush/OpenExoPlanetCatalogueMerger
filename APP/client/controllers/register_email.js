app.controller('register_email', function($scope, $http) {

  $scope.loginInfo = '';
  $scope.registerEmail = function() {
    $http({
      method: 'PUT',
      url: '/api/email',
      'firstname': $scope.firstname,
       'lastname': $scope.lastname,
       'email': $scope.email
    }).then(function successCallBack(res) {
      $scope.loginInfo = res.data;
    }, function errorCallBack(res) {
      $scope.error = res.status +  " - " + res.statusText;
    });
  }
});
