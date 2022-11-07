app.controller("dashboard-ctrl", function ($scope, $http, $compile, $filter) {
    var url = "https://nghienteam.studio/api/product/getTop5Product";
    var url1 = "https://nghienteam.studio/api/product/getTop5Customer";
    var url2 = "https://nghienteam.studio/api/product/getDailyRevenue";
    $scope.items = [];
    $scope.items1 = [];
    $scope.items2 = [];

    //load data
    $http.get(url).then(resp => {
        $scope.items = resp.data;
    });

    $http.get(url1).then(resp => {
        feather.replace();
        $scope.items1 = resp.data;
    });

    $http.get(url2).then(resp => {
        $scope.items2 = resp.data;
    });
});