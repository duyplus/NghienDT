app.controller("checkout-ctrl", function ($scope, HOST, $cart, $http, $window, authService) {
    var urluser = `${HOST}/api/user`;
    var urlprod = `${HOST}/api/product`;
    var urlorder = `${HOST}/api/order`;
    var urlorderdetail = `${HOST}/api/orderdetail`;

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
        var datetime = new Date();
        $scope.order.createdat = datetime.getTime();
        $scope.order.updatedat = datetime.getTime();
        // * GET user
        $scope.order.user = $scope.userid;

        var item = angular.copy($scope.order);
        console.log(item);
        await $http.post(`${urlorder}`, item).then((resp) => {
            $scope.orders.push(resp.data);
            $scope.order.id = resp.data.id;
        });
        

        // * Recover Order
        var item2 = angular.copy($scope.order);
        // * POST orderdetail
        for (const cart of $cart.values) {
            $scope.orderdetail.price = cart.price;
            $scope.orderdetail.quantity = cart.quantity;
            $scope.orderdetail.status = '1';
            $scope.orderdetail.order = item2;
            $scope.orderdetail.product = cart;
            $scope.orderdetail.reviewed = false;

            var itemoddt = angular.copy($scope.orderdetail);
            console.log(itemoddt);
            await $http.post(`${urlorderdetail}`, itemoddt).then(response => {
                $scope.orderdetails.push(response.data);
            })
            //subtract quantity prod
            var product = {}
            await $http.get(urlprod + '/' + cart.id).then(resp => {
                product = resp.data;
            })
            product.quantity = (product.quantity - cart.quantity);
            var subtracted = product;
            await $http.put(urlprod + '/' + cart.id, subtracted).then(resp => {
                console.log(resp.data);
            })
        }
        sweetalert_success("Thanh toán thành công")
        localStorage.removeItem("cart");
        $window.location.href = 'http://127.0.0.1:5500/#!/';
        window.location.reload();
    }

    // Get info user
    $scope.findUserDetail = () => {
        var getNameUser = localStorage.getItem("currentUser");
        $http.get(urluser).then(resp => {
            $scope.userid = resp.data.filter(item => item.username === getNameUser)[0];
        })
    }
});