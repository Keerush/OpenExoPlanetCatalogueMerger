app.controller('register_email', function($scope, $http) {
  $scope.loginInfo = {};

  $scope.registerEmail = function() {
    $http.post('/api/addEmail', $scope.loginInfo)
    .then(function successCallBack(res) {
      $scope.loginInfo = res.data;
      console.log('Success')
    }, function errorCallBack(res) {
      $scope.error = res.status + " - " + res.statusText;
    });
  }
