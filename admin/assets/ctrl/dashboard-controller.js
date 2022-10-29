app.controller("dashboard-ctrl", function ($scope, $http, $compile) {
    var url = "http://localhost:8080/api/product/getTop5SP";
    $scope.items = [];

    //load data
    $http.get(url).then(resp => {
        $scope.items = resp.data;
    });
});