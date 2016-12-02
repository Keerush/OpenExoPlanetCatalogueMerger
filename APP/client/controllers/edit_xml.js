app.controller('edit_xml', function($scope, $http, $window, $location) {
  $scope.editedData = '';

  $scope.submitFunction = function() {
    var change = {};
    change['filename'] = $scope.$parent.dataList[0].open.fileName;
    change['tableName'] = $scope.$parent.dataList[0].open.tableName;
    for (var currKey in $scope.$parent.dataList[0].nasa) {
      if ($scope.$parent.dataList[0].nasa[currKey] !== null) {
        change[currKey.replace('n_', '')] = $scope.$parent.dataList[0].nasa[currKey];
      }
    }

    $http.post("api/editXmls", [change])
      .then(function successCallBack(res) {
        $scope.editedData = res.data;
        $window.alert("Your Changes have been saved but not yet pushed to the database.\n" +
          "Please press the submit button to push all changes into the database.");
        $location.path('public/show_updates')
      }, function errorCallBack(res) {
        $scope.error = res.status + " - " + res.statusText;
        $location.path('public/show_updates')
      });
  }

  $scope.getInfo = function() {
    console.log("dl 0 is ", $scope.$parent.dataList[0].nasa);
    return $scope.$parent.dataList;
  }
  $scope.cancelFunction = function() {
    $scope.$parent.dataList = [];
    $window.alert("All Changes Made were Unsaved.");
    $location.path('public/show_updates');
  }

  $scope.trimKey = function(key) {
    console.log('here');
    return key.replace('n_', '').replace('e_', '');
  }
});