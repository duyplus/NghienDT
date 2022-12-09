app.controller("checkout-ctrl", function ($scope, HOST, $cart, $http, $window, authService) {
    var urlorder = "http://157.245.157.128/v1/api/order";
    var urlorderdetail = "http://157.245.157.128/v1/api/orderdetail";

    $scope.users = [];
    $scope.orderdetails = [];
    $scope.orders = [];

    $scope.orderdetail = {};
    $scope.order = {};
    $scope.userid = {};

    $scope.isAuthed = function () {
        return authService.isAuthed ? authService.isAuthed() : false;
    };

    $http.get(HOST + "/api/user").then((resp) => {
        $scope.users = resp.data;
    });

    $http.get(HOST + "/api/orderdetail").then((resp) => {
        $scope.orderdetails = resp.data;
    });

    $http.get(HOST + "/api/order").then((resp) => {
        $scope.orders = resp.data;
    });

    $scope.checkout = async () => {
        // * POST Order
        $scope.order.createdat = moment().format('YYYY-MM-DD hh:mm');
        $scope.order.updatedat = moment().format('YYYY-MM-DD hh:mm');
        // * GET user
        $scope.order.user = $scope.userid;

        var item = angular.copy($scope.order);
        await $http.post(`${urlorder}`, item).then((resp) => {
            $scope.orders.push(resp.data);
            $scope.order.id = resp.data.id;
            alert("Succes")
        });

        // * Recover Order
        var item2 = angular.copy($scope.order);;
        // * POST orderdetail
        for (const cart of $cart.values) {
            $scope.orderdetail.price = cart.price;
            $scope.orderdetail.quantity = cart.quantity;
            $scope.orderdetail.status = '1';
            $scope.orderdetail.order = item2;
            $scope.orderdetail.product = cart;

            var itemoddt = angular.copy($scope.orderdetail);
            await $http.post(`${urlorderdetail}`, itemoddt).then((response) => {
                $scope.orderdetails.push(response.data);
            })
        }
    }

    $scope.findUserAndProd = () => {
        var getNameUser = localStorage.getItem("currentUser");
        $scope.userid = $scope.users.filter(function (item) {
            return item.username === getNameUser;
        })[0];
    }
});