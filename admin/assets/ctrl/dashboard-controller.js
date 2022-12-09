app.controller("dashboard-ctrl", function ($scope, $http, $compile, $filter) {
    var url = "http://157.245.157.128/v1/api/product/getTopProduct";
    var url1 = "http://157.245.157.128/v1/api/product/getTopCustomer";
    var url2 = "http://157.245.157.128/v1/api/product/getDailyRevenue";
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