app.controller('show_updates', function($scope, $http, $window, $location) {

    $scope.gitURL = "https://github.com/login/oauth/authorize?client_id=976efe23b3dbd42727fc&scope=public_repo&callback_url=cmsvm35.utsc.utoronto.ca/public/show_update"
    checkGit = function() {
        var searchObject = $location.search();
	console.log("SEARCH OBJECT IS: ", searchObject);
        if (searchObject['code']) {
            var options = {
                "client_id": "976efe23b3dbd42727fc",
                "client_secret": "a55e34d7ccf86cb6464b1aa6dae7c9d9d0feab35",
                "code": searchObject['code'],
                "state": "ILOVENISEKOI"
            };
            $http.post("https://github.com/login/oauth/access_token", options).then(function successCallBack(res) {
                console.log(res);
                $http.put('/api/fork', {
                    access_token: res.access_token
                });
            }, function errorCallBack(res) {
                $scope.error = res.status + " - " + res.statusText;
            });

        }
    }
    checkGit();
    $scope.nasaStarData = '';
    $scope.nasaPlanetData = '';
    $scope.nasaSystemData = '';
    $scope.euStarData = '';
    $scope.euPlanetData = '';
    $scope.euSystemData = '';
    $scope.editedData = '';

    $scope.dataList = [];

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
            $scope.error = res.status + " - " + res.statusText;
        });
    }
    $scope.getNasaSystemDiff = function() {
        console.log("parent scope is ", $scope.$parent.dataList);

        $http({
            method: 'GET',
            url: '/api/getNasaSystemDiff?limit=5&offset=0'
        }).then(function successCallBack(res) {
            $scope.nasaSystemData = res.data;
        }, function errorCallBack(res) {
            $scope.error = res.status + " - " + res.statusText;
        });
    }

    $scope.getEuStarDiff = function() {
        $http({
            method: 'GET',
            url: '/api/getEuStarDiff?limit=5&offset=0'
        }).then(function successCallBack(res) {
            $scope.euStarData = res.data;
        }, function errorCallBack(res) {
            $scope.error = res.status + " - " + res.statusText;
        });
    }

    $scope.getEuPlanetDiff = function() {
        $http({
            method: 'GET',
            url: '/api/getEuPlanetDiff?limit=5&offset=0'
        }).then(function successCallBack(res) {
            $scope.euPlanetData = res.data;
        }, function errorCallBack(res) {
            $scope.error = res.status + " - " + res.statusText;
        });
    }

    $scope.getEuSystemDiff = function() {
        $http({
            method: 'GET',
            url: '/api/getEuSystemDiff?limit=5&offset=0'
        }).then(function successCallBack(res) {
            $scope.euSystemData = res.data;
        }, function errorCallBack(res) {
            $scope.error = res.status + " - " + res.statusText;
        });
    }

    $scope.submitFunction = function() {
        $http.get("https://github.com/login/oauth/authorize", {
            client_id: "976efe23b3dbd42727fc",
            scope: "public_repo",
            state: "ILOVENISEKOI",
            allow_signup: "false"
        }).then(function successCallBack(res) {
            $scope.editedData = res.data;
            $window.alert("Your Edits have been Saved into the Database!");
        }, function errorCallBack(res) {
            $scope.error = res.status + " - " + res.statusText;
        });
    }

    $scope.cancelFunction = function() {
        $window.alert("All Changes Made were Unsaved.");
    }


    $scope.addInfo = function(obj) {
        console.log("here ", obj);
        if ($scope.$parent.dataList) {
            $location.path('/public/edit_xml')
            return;
        }
        $scope.$parent.dataList = [];
        $scope.$parent.dataList.push(obj);
        // $location.path("public/edit_xml");
        console.log($scope.$parent.dataList);
        $location.path('/public/edit_xml')
    }

    $scope.getInfo = function() {
        console.log($scope.$parent.dataList);
        return $scope.$parent.dataList;
    }
    console.log("initiating this controller");
});
