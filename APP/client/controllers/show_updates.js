app.controller('show_updates', function($scope, $http, $window) {

  $scope.nasaStarData = '';
  $scope.nasaPlanetData = '';
  $scope.nasaSystemData = '';
  $scope.euStarData = '';
  $scope.euPlanetData = '';
  $scope.euSystemData = '';
  $scope.editedData = '';

  $scope.getNasaPlanetDiff = function() {
    $http({
      method: 'GET',
      url: '/api/getNasaPlanetDiff?limit=5&offset=0'
    }).then(function successCallBack(res) {
      $scope.nasaPlanetData = res.data;
    }, function errorCallBack(res) {
      $scope.error = res.status + " - " + res.statusText;
    });
  }

  $scope.getNasaStarDiff = function() {
    $http({
      method: 'GET',
      url: '/api/getNasaStarDiff?limit=5&offset=0'
    }).then(function successCallBack(res) {
      $scope.nasaStarData = res.data;
    }, function errorCallBack(res) {
      $scope.error = res.status +  " - " + res.statusText;
    });
  }
  $scope.getNasaSystemDiff = function() {
    $http({
      method: 'GET',
      url: '/api/getNasaSystemDiff?limit=5&offset=0'
    }).then(function successCallBack(res) {
      $scope.nasaSystemData = res.data;
    }, function errorCallBack(res) {
      $scope.error = res.status +  " - " + res.statusText;
    });
  }

  $scope.getEUStarDiff = function() {
    $http({
      method: 'GET',
      url: '/api/getEUStardiff?limit=1&offset=0'
    }).then(function successCallBack(res) {
      $scope.euStarData = res.data;
    }, function errorCallBack(res) {
      $scope.error = res.status +  " - " + res.statusText;
    });
  }

  $scope.getEUPlanetDiff = function() {
    $http({
      method: 'GET',
      url: '/api/getEUPlanetDiff?limit=1&offset=0'
    }).then(function successCallBack(res) {
      $scope.euPlanetData = res.data;
    }, function errorCallBack(res) {
      $scope.error = res.status +  " - " + res.statusText;
    });
  }

  $scope.getEUSystemDiff = function() {
    $http({
      method: 'GET',
      url: '/api/getEUSystemDiff?limit=1&offset=0'
    }).then(function successCallBack(res) {
      $scope.euSystemData = res.data;
    }, function errorCallBack(res) {
      $scope.error = res.status +  " - " + res.statusText;
    });
  }

  $scope.submitFunction = function() {
    $http({
      method: 'POST',
      url: '/api/addOpenData'
    }).then(function successCallBack(res) {
      $scope.editedData = res.data;
      $window.alert("Your Edits have been Saved into the Database!");
    }, function errorCallBack(res){
      $scope.error = res.status + " - " + res.statusText;
    });
  }

  $scope.cancelFunction = function() {
    $window.alert("All Changes Made were Unsaved.");
  }

  $scope.addInfo = function(obj) {
    var $scope.$parent.dataList = [];
    dataList.push(obj);
    // $location.path("public/edit_xml");
    console.log(dataList);
  }

  $scope.getInfo = function() {
    return dataList;
  }
  console.log("initiating this controller");
});

//
// app.service('addXml', function()) {
//   var nameList = [];
//
//   var addInfo = function(obj) {
//     nameList.push(obj);
//   };
//
//   var getInfo = function() {
//    return nameList;
//   };
//
//   return {
//     addInfo: addInfo,
//     getInfo: getInfo
//   };
// }
//
// app.controller('transferXml', function($scope, show_updates) {
//   $scope.callToAddToInfo = function(obj) {
//     show.addInfo(obj);
//   };
// });
