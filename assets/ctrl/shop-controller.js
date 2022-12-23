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

    $scope.sortBy = function (propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.filter = (name) => {
        $scope.q = name;
    }

    //Add class active for cate & compa
    const divs = document.querySelectorAll('.filter-attribute-container');

    divs.forEach(el => el.addEventListener('click', event => {
        event.target.classList.toggle("active");
    }));

    $scope.currentPage = 0;
    $scope.pageSize = 12;
    $scope.q = '';

    $scope.getData = function () {
        return $filter('filter')($scope.products, $scope.q)
    }

    $scope.numberOfPages = function () {
        return Math.ceil($scope.products.length / $scope.pageSize);
    }

    $scope.showDate = (val) => {
        var date1 = new Date();
        var date2 = new Date(val);
        var diffMonths = date2.getMonth() - date1.getMonth();
        var diffDays = date2.getDate() - date1.getDate();
        var diffYears = date2.getYear() - date1.getYear();
        diffMonths += 12 * diffYears

        if (diffDays < 0) {
            diffMonths -= 1;
            var daysInMonth = new Date(date2.getYear(), date2.getMonth() - 1, 0).getDate();
            diffDays = daysInMonth + diffDays;
        }
        console.log('The difference between the two dates is ' + diffMonths + ' months and ' + diffDays + ' days');

        if (diffMonths === 0 && diffDays <= 7) {
            return true;
        }
        return false;
    }
});