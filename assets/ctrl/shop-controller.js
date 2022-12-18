app.controller('shop-ctrl', function ($scope, $filter, $http, HOST, $cart, $product, $utility) {
    const { $data, $url, $templateUrl } = $utility;

    $scope.templateUrl = $templateUrl.getHomeTemplates();
    // Paging
    $scope.products = [];
    $scope.categories = [];
    $scope.companies = [];

    $http.get(HOST + "/api/product").then((resp) => {
        $scope.products = resp.data;
    });

    $http.get(HOST + "/api/category").then((resp) => {
        $scope.categories = resp.data;
    });

    $http.get(HOST + "/api/company").then((resp) => {
        $scope.companies = resp.data;
    });

    $scope.addCart = (product) => {
        $cart.addItem(product);
    };

    $scope.viewProduct = (event, product) => {
        event.preventDefault();
        $product.current = product;
        $url.redirectToProductPage();
    };

    $scope.propertyName = '';
    $scope.reverse = true;

    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.filter = (name) => {
        $scope.q = name;
    }

    $scope.currentPage = 0;
    $scope.pageSize = 12;
    $scope.q = '';

    $scope.getData = function () {
        return $filter('filter')($scope.products, $scope.q)
    }

    $scope.numberOfPages = function () {
        return Math.ceil($scope.products.length / $scope.pageSize);
    }
});