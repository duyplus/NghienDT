const app = angular.module("myApp", [
    "ngRoute",
    "ui.bootstrap",
    "slickCarousel"
]);
app.config(function ($routeProvider, $httpProvider) {
    // route
    $routeProvider
        .when("/", {
            templateUrl: "pages/home.html",
            controller: "home-ctrl",
        })
        .when("/shop", {
            templateUrl: "pages/shop.html",
            controller: "shop-ctrl",
        })
        .when("/product", {
            templateUrl: "pages/product.html",
            controller: "product-ctrl",
        })
        .when("/wishlist", {
            templateUrl: "pages/wishlist.html",
            controller: "wishlist-ctrl",
        })
        .when("/cart", {
            templateUrl: "pages/cart.html",
            controller: "cart-ctrl",
        })
        .when("/checkout", {
            templateUrl: "pages/checkout.html",
            controller: "checkout-ctrl",
        })

        .when("/my-account", {
            templateUrl: "pages/my-account.html",
            controller: "user-ctrl",
        })
        .when("/forgot-password", {
            templateUrl: "pages/forgot-password.html",
            controller: "user-ctrl",
        })
        .when("/register", {
            templateUrl: "pages/register.html",
            controller: "user-ctrl",
        })
        .when("/login", {
            templateUrl: "pages/login.html",
            controller: "user-ctrl",
        })

        .when("/contact-us", {
            templateUrl: "pages/contact-us.html",
        })
        .when("/404", {
            templateUrl: "pages/404.html",
        })
        .otherwise({
            redirectTo: "/",
        });

    $httpProvider.interceptors.push("authInterceptor");
});

app.constant("HOST", "https://nghienteam.studio");

app.directive("convertDate", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            ngModel.$formatters.push(function (fromModel) {
                fromModel = new Date(fromModel);
                return fromModel;
            });
            ngModel.$parsers.push(function (fromField) {
                fromField = fromField.getTime();
                return fromField;
            });
        },
    };
});

app.directive("owlCarousel", function () {
    return {
        restrict: "E",
        transclude: false,
        link: function (scope) {
            scope.initCarousel = function (element) {
                var defaultOptions = {};
                var customOptions = scope.$eval($(element).attr("data-options"));
                for (var key in customOptions) {
                    defaultOptions[key] = customOptions[key];
                }
                var curOwl = $(element).data("owlCarousel");
                if (!angular.isDefined(curOwl)) {
                    $(element).owlCarousel(defaultOptions);
                }
                scope.cnt++;
            };
        },
    };
}).directive("owlCarouselItem", [
    function () {
        return {
            restrict: "A",
            transclude: false,
            link: function (scope, element) {
                if (scope.$last) {
                    scope.initCarousel(element.parent());
                }
            },
        };
    },
]);

app.run(($rootScope, $cart) => {
    $rootScope.cart = $cart;
});

