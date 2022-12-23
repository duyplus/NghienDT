app.controller("checkout-ctrl", function ($scope, HOST, $cart, $http, $window, authService) {
    var urlorder = "http://157.245.157.128/v1/api/order";
    var urlorderdetail = "http://157.245.157.128/v1/api/orderdetail";

    $scope.users = [];
    $scope.orderdetails = [];
    $scope.orders = [];

    $scope.orderdetail = {};
    $scope.order = {};
    $scope.userid = {};

    var sweetalert_success = function (text) {
        Swal.fire({
            icon: "success",
            title: text,
            showConfirmButton: false,
            timer: 2000,
        });
    }


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
        await $http.post(HOST + '/api/order', item).then((resp) => {
            $scope.orders.push(resp.data);
            $scope.order.id = resp.data.id;
            sweetalert_success("Thanh toán thành công")
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
            await $http.post(HOST + '/api/orderdetail', itemoddt).then((response) => {
                $scope.orderdetails.push(response.data);
            })
            var product = {}
            await $http.get(HOST + '/api/product/' + cart.id).then(resp => {
                product = resp.data;
            })
            product.quantity = (product.quantity - cart.quantity);
            var subtracted = product;
            await $http.put(HOST + '/api/product/' + cart.id, subtracted).then(resp => {
                console.log(resp.data);
            })
        }

        localStorage.removeItem("cart");
        $window.location.href = 'http://127.0.0.1:5500/#!/';
        window.location.reload();
    }

    $scope.findUserDetail = () => {
        var getNameUser = localStorage.getItem("currentUser");
        $http.get(HOST + '/api/user').then(resp => {
            $scope.userid = resp.data.filter(item => item.username === getNameUser)[0];
        })
    }
});