const app = angular.module("myApp", ['ngRoute', 'ui.bootstrap']);
app.config(function ($routeProvider, $locationProvider) {
    // route
    $routeProvider
        .when("/category-list", { templateUrl: "admin/pages/category-list.html", controller: "category-ctrl" })
        .when("/category-form", { templateUrl: "admin/pages/category-form.html", controller: "category-ctrl" })

        .when("/company-list", { templateUrl: "admin/pages/company-list.html", controller: "company-ctrl" })
        .when("/company-form", { templateUrl: "admin/pages/company-form.html", controller: "company-ctrl" })

        .when("/product-list", { templateUrl: "admin/pages/product-list.html", controller: "product-ctrl" })
        .when("/product-form", { templateUrl: "admin/pages/product-form.html", controller: "product-ctrl" })

        .when("/order-approval", { templateUrl: "admin/pages/order-approval.html", controller: "order-ctrl" })
        .when("/order-list", { templateUrl: "admin/pages/order-list.html", controller: "order-ctrl" })
        .when("/orderdetail", { templateUrl: "admin/pages/orderdetail.html", controller: "order-ctrl" })

        .when("/review-list", { templateUrl: "admin/pages/review-list.html", controller: "review-ctrl" })
        .when("/review-form", { templateUrl: "admin/pages/review-form.html", controller: "review-ctrl" })

        .when("/user-list", { templateUrl: "admin/pages/user-list.html", controller: "user-ctrl" })
        .when("/user-form", { templateUrl: "admin/pages/user-form.html", controller: "user-ctrl" })

        .when("/statistic", { templateUrl: "admin/pages/statistic.html", controller: "statistic-ctrl" })
        .when("/setting", { templateUrl: "admin/pages/setting.html", controller: "setting-ctrl" })

        .when('/', { templateUrl: 'admin/pages/dashboard.html', controller: "dashboard-ctrl" })
        .when("/login", { templateUrl: "admin/pages/login.html" })
        .when("/404", { templateUrl: "admin/pages/404.html" })
        .otherwise({ redirectTo: '/' });
});

app.constant("HOST", "http://157.245.157.128/v1");

app.directive('convertDate', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$formatters.push(function (fromModel) {
                fromModel = new Date(fromModel);
                return fromModel;
            });
            ngModel.$parsers.push(function (fromField) {
                fromField = fromField.getTime();
                return fromField;
            });
        }
    }
});

app.directive('stringToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (value) {
                return '' + value;
            });
            ngModel.$formatters.push(function (value) {
                return parseInt(value);
            });
        }
    };
});

app.factory('userService', function () {
    var savedData = {}
    function set(data) {
        savedData = data;
    }
    function get() {
        return savedData;
    }
    return {
        set: set,
        get: get
    }
});

app.factory('companyService', function () {
    var savedData = {}
    function set(data) {
        savedData = data;
    }
    function get() {
        return savedData;
    }
    return {
        set: set,
        get: get
    }
});

app.factory('productService', function () {
    var savedData = {}
    function set(data) {
        savedData = data;
    }
    function get() {
        return savedData;
    }
    return {
        set: set,
        get: get
    }
});


app.factory('cateService', function () {
    var savedData = {}
    function set(data) {
        savedData = data;
    }
    function get() {
        return savedData;
    }
    return {
        set: set,
        get: get
    }
});


app.factory('reviewService', function () {
    var savedData = {}
    function set(data) {
        savedData = data;
    }
    function get() {
        return savedData;
    }
    return {
        set: set,
        get: get
    }
});

app.factory('orderService', function () {
    var savedData = {}
    function set(data) {
        savedData = data;
    }
    function get() {
        return savedData;
    }
    return {
        set: set,
        get: get
    }
});
