app.controller('order-ctrl', function ($scope, $location, $http, orderService, HOST , $cart) {
    var urlOrder = `${HOST}/api/order`;
    var urlOrderDetail = `${HOST}/api/orderdetail`;
    var urlDetailOfOrder = `${HOST}/api/orderdetail/pro`
    var urlOrderApproval = `${HOST}/api/orderdetail/approval`

    $scope.orderdata = orderService.get();
    $scope.items = [];
    $scope.item = {};
    $scope.orderFinish = [];
    $scope.orderCancel = [];
    $scope.itemDetail = [];
    $scope.orders = [];
    $scope.orderseller = [];
    $scope.isRowCollapsed = true;
    $scope.currentUser = localStorage.getItem('currentUser');
    $scope.itemsd = {};

    var sweetalert_error = function (text) {
        Swal.fire({
            icon: "error",
            title: text,
            showConfirmButton: false,
            timer: 2000,
        });
    }
    
    //load order detail by status 
    $scope.loadOrderDetailByStatus = function (status) {
        $http.get(`${urlOrderApproval}/${status}`).then(resp => {
            if(status == 3){
                $scope.orderCancel = resp.data.filter(item => item.order.user.username == $scope.currentUser);
            }else if(status == 4){
                $scope.orderFinish = resp.data.filter(item => item.order.user.username == $scope.currentUser);
            }
           
        });

    }

    //load order data 
    $scope.loadOrderData = function () {
        $http.get(urlOrder).then(resp => {
            $scope.items = resp.data.filter(item => item.user.username == $scope.currentUser);
            for (var i = 0; i < $scope.items.length; i++) {
                this.getDetailItem($scope.items[i].id);
            }
        });

    }

    //load order seller data 
    $scope.loadOrderSellerData = function () {
        $http.get(urlOrderDetail).then(resp => {
            $scope.orderseller = resp.data.filter(item => item.product.user.username == $scope.currentUser);
        });

    }

    //load detail for order
    $scope.getDetailItem = function (id) {
        var tempItem = {};
        $http.get(`${urlOrder}/${id}`).then(resp => {
            $scope.itemsd = resp.data;
            tempItem = null;
            tempItem = $scope.itemsd;
            $http.get(`${urlDetailOfOrder}/${tempItem.id}`).then(respose => {
                $scope.itemDetail = respose.data;
                var tempDetail = $scope.itemDetail;
                tempItem.detail = tempDetail;
                //get Total Price
                var TempPrice = 0;
                for (var i = 0; i < $scope.itemDetail.length; i++) {
                    TempPrice += $scope.itemDetail[i].price;
                    $scope.totalPrice = TempPrice;
                }
                tempItem.totalPrice = $scope.totalPrice;
                $scope.totalPrice = 0;
                tempItem.status = this.getOrderStatus(tempDetail);
            });
            $scope.itemsd = tempItem;
            $scope.orders.push($scope.itemsd);
        });
    }

    //get Order Status
    $scope.getOrderStatus = function (detail) {
        for (var k = 0; k < detail.length; k++) {
            var odetail = detail[k];
            if (odetail != undefined && odetail != null) {
                var status;
                var detailst = odetail.status;
                if (detailst == 1 || detailst == 2) {
                    return status = 1;
                } else {
                    status = 2;
                }
            } else if (odetail == undefined || odetail == null) {
                return status = 0;
            }
        }
        return status;
    }

    //reorder
    $scope.addCart = (product) => {
        $cart.addItem(product,1);
    };


    //hien thi len chi tiết - chi tiết đơn hàng
    $scope.detail = function (item) {
        orderService.set(item);
    }

    //load detail data - chi tiết đơn hàng
    $scope.getDetail = function (id) {
        if (id == null) {
            sweetalert_error("Chọn đơn hàng để xem chi tiết");
            $location.path('my-account');
        } else {
            $http.get(`${urlDetailOfOrder}/${id}`).then(resp => {
                $scope.details = resp.data;

                //get Total Price
                var TempPrice = 0;
                for (var i = 0; i < $scope.details.length; i++) {
                    TempPrice += $scope.details[i].price;
                    $scope.totalPrice = TempPrice;
                }
            })
        }
    };

    $scope.filterSellerOrder = function (item){
        return item.status == 1 || item.status == 2;
    }
})
    .directive('date', function (dateFilter) {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {

                var dateFormat = attrs['date'] || 'yyyy-MM-dd';

                ctrl.$formatters.unshift(function (modelValue) {
                    return dateFilter(modelValue, dateFormat);
                });
            }
        };
    })
    .directive('dir', function () {
        return {
            link: function (scope, elem, attrs) {
                $(elem).on('click', function () {
                    $(this)
                        .parent('tr')
                        .next('tr')
                        .toggle();
                })
            }
        }
    })