app.controller('show_updates', function($scope, $http) {

  $scope.nasaStarData = '';
  $scope.nasaPlanetData = '';
  $scope.nasaSystemData = '';
  $scope.euStarData = '';
  $scope.euPlanetData = '';
  $scope.euSystemData = '';

  $scope.getNasaPlanetDiff = function() {
    $http({
      method: 'GET',
      url: 'public/index.js??'
    }).then(function successCallBack(res) {
      $scope.nasaStarData = res.data;
    }, function errorCallBack(res) {
      $scope.error = res.status + " - " + res.statusText;
    });
  }

  $scope.getNasaStarDiff = function() {
    $http({
      method: 'GET',
      url: 'public/index.js?'
    }).then(function successCallBack(res) {
      $scope.nasaPlanetData = res.data;
    }, function errorCallBack(res) {
      $scope.error = res.status +  " - " + res.statusText;
    });
  }
  $scope.getNasaSystemDiff = function() {
    $http({
      method: 'GET',
      url: 'public/index.js?'
    }).then(function successCallBack(res) {
      $scope.nasaSystemData = res.data;
    }, function errorCallBack(res) {
      $scope.error = res.status +  " - " + res.statusText;
    });
  }

  $scope.getEUStarDiff = function() {
    $http({
      method: 'GET',
      url: 'public/index.js?'
    }).then(function successCallBack(res) {
      $scope.euStarData = res.data;
    }, function errorCallBack(res) {
      $scope.error = res.status +  " - " + res.statusText;
    });
  }

  $scope.getEUPlanetDiff = function() {
    $http({
      method: 'GET',
      url: 'public/index.js?'
    }).then(function successCallBack(res) {
      $scope.euPlanetData = res.data;
    }, function errorCallBack(res) {
      $scope.error = res.status +  " - " + res.statusText;
    });
  }

  $scope.getEUSystemDiff = function() {
    $http({
      method: 'GET',
      url: 'public/index.js?'
    }).then(function successCallBack(res) {
      $scope.euSystemData = res.data;
    }, function errorCallBack(res) {
      $scope.error = res.status +  " - " + res.statusText;
    });
  }

});
