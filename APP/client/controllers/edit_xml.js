app.controller('edit_xml', function($scope, $http, $window, $location) {
  $scope.editedData = '';

  $scope.submitFunction = function() {
    $http({
      method: 'POST',
      url: '/api/editXmls'
    }).then(function successCallBack(res) {
      $scope.editedData = res.data;
      $window.alert("Your Changes have been saved but not yet pushed to the database.\n" +
      "Please press the submit button to push all changes into the database.");
    }, function errorCallBack(res){
      $scope.error = res.status + " - " + res.statusText;
      $location.path('public/show_updates')
    });
  }

  $scope.getInfo = function() {
    console.log($scope.$parent.dataList);
    return $scope.$parent.dataList;
  }
  $scope.cancelFunction = function() {
    $window.alert("All Changes Made were Unsaved.");
    $location.path('public/show_updates');
  }
});
