app.controller('show_updates', function($scope, $http, $window, $location) {

    $scope.gitURL = "https://github.com/login/oauth/authorize?client_id=976efe23b3dbd42727fc&scope=public_repo&callback_url=cmsvm35.utsc.utoronto.ca/public/show_update"
    checkGit = function() {
        var searchObject = $location.search();
        console.log("SEARCHOBJECT IS: ", searchObject);

        if (searchObject['code']) {
            var options = {
                "code": searchObject['code'],
            };
            $http.put("api/token", options).then(function successCallBack(res) {
                $scope.access_token = res.access_token;
                $http.put("api/fork", {
                    "access_token": $scope.access_token
                })
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
    $scope.offset = 0;
    $scope.limit = 5;

    $scope.dataList = [];

    $scope.getNasaPlanetDiff = function(limit, offset) {
        $http({
            method: 'GET',
            url: '/api/getNasaPlanetDiff?limit=' + limit + '&offset=' + offset
        }).then(function successCallBack(res) {
            $scope.nasaPlanetData = res.data;
        }, function errorCallBack(res) {
            $scope.error = res.status + " - " + res.statusText;
        });
    }

    $scope.getNasaStarDiff = function(limit, offset) {
        $http({
            method: 'GET',
            url: '/api/getNasaStarDiff?limit=' + limit + '&offset=' + offset
        }).then(function successCallBack(res) {
            $scope.nasaStarData = res.data;
        }, function errorCallBack(res) {
            $scope.error = res.status + " - " + res.statusText;
        });
    }

    $scope.getNasaSystemDiff = function(limit, offset) {
        console.log("parent scope is ", $scope.$parent.dataList);

        $http({
            method: 'GET',
            url: '/api/getNasaSystemDiff?limit=' + limit + '&offset=' + offset
        }).then(function successCallBack(res) {
            $scope.nasaSystemData = res.data;
        }, function errorCallBack(res) {
            $scope.error = res.status + " - " + res.statusText;
        });
    }

    $scope.getEuStarDiff = function(limit, offset) {
        $http({
            method: 'GET',
            url: '/api/getEuStarDiff?limit=' + limit + '&offset=' + offset
        }).then(function successCallBack(res) {
            $scope.euStarData = res.data;
        }, function errorCallBack(res) {
            $scope.error = res.status + " - " + res.statusText;
        });
    }

    $scope.getEuPlanetDiff = function(limit, offset) {
        $http({
            method: 'GET',
            url: '/api/getEuPlanetDiff?limit=' + limit + '&offset=' + offset
        }).then(function successCallBack(res) {
            $scope.euPlanetData = res.data;
        }, function errorCallBack(res) {
            $scope.error = res.status + " - " + res.statusText;
        });
    }

    $scope.getEuSystemDiff = function(limit, offset) {
        $http({
            method: 'GET',
            url: '/api/getEuSystemDiff?limit=' + limit + '&offset=' + offset
        }).then(function successCallBack(res) {
            $scope.euSystemData = res.data;
        }, function errorCallBack(res) {
            $scope.error = res.status + " - " + res.statusText;
        });
    }

    $scope.nextPage = function() {
        $scope.offset += $scope.limit;
        $scope.getNasaPlanetDiff($scope.limit, $scope.offset);
        $scope.getNasaStarDiff($scope.limit, $scope.offset);
        $scope.getNasaSystemDiff($scope.limit, $scope.offset);
        $scope.getEuPlanetDiff($scope.limit, $scope.offset);
        $scope.getEuStarDiff($scope.limit, $scope.offset);
        $scope.getEuSystemDiff($scope.limit, $scope.offset);
    }

     $scope.backPage = function() {
        $scope.offset -= $scope.limit;
        $scope.getNasaPlanetDiff($scope.limit, $scope.offset);
        $scope.getNasaStarDiff($scope.limit, $scope.offset);
        $scope.getNasaSystemDiff($scope.limit, $scope.offset);
        $scope.getEuPlanetDiff($scope.limit, $scope.offset);
        $scope.getEuStarDiff($scope.limit, $scope.offset);
        $scope.getEuSystemDiff($scope.limit, $scope.offset);
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
        $scope.$parent.dataList = [];
        $scope.$parent.dataList.push(obj);
        $location.path('/public/edit_xml')
    }

    $scope.getInfo = function() {
        console.log($scope.$parent.dataList);
        return $scope.$parent.dataList;
    }
});