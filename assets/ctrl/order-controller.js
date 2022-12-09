app.controller('order-ctrl', function ($scope, $location, $http, $rootScope, orderService,$timeout) {
    var urlOrder = "http://localhost:8080/api/order";
    var urlOrderDetail = "http://localhost:8080/api/orderdetail";
    var urlDetailOfOrder = "http://localhost:8080/api/orderdetail/pro"

    $scope.orderdata = orderService.get();
    $scope.items = [];
    $scope.item = {};
    $scope.itemDetail = [];
    $scope.orders = [];
    $scope.isRowCollapsed = true;
    $scope.statusCode;
    $scope.currentUser = localStorage.getItem('currentUser');
    $scope.itemsd = {};

    //load order data 
    $scope.loadOrderData = function () {
        $http.get(urlOrder).then(resp => {
            $scope.items = resp.data.filter(item => item.user.username == $scope.currentUser);
            for (var i = 0; i < $scope.items.length; i++) {
                this.getDetailItem($scope.items[i].id);
            }
            
        });
    }
 console.log($scope.orders)
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
                var status = 0;
                var TempPrice = 0;
                for (var i = 0; i < $scope.itemDetail.length; i++) {
                    TempPrice += $scope.itemDetail[i].price;
                    $scope.totalPrice = TempPrice;
                    // status =$scope.itemDetail[i].status;
                    // if($scope.itemDetail[i].status == 1 || $scope.itemDetail[i].status == 2){
                    //     return status;
                    // }
                }

                // tempItem.status = status;
                tempItem.totalPrice =  $scope.totalPrice;
                $scope.totalPrice = 0;
              
            });
            $scope.itemsd = tempItem;
            $scope.orders.push($scope.itemsd);
        });
    }
    //hien thi len chi tiết - chi tiết đơn hàng
    $scope.detail = function (item) {
        orderService.set(item);
    }

    //load detail data - chi tiết đơn hàng
    $scope.getDetail = function (id) {
        if (id == null) {
            alert("Id not found");
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
    $scope.filterOrder = function(item){
        var detail = item.detail;
        var temp = Object.keys(detail).length;
        console.log(temp);
        for(var i = 0 ; i < temp; i++) {
            var detailst = detail[i].status;
            return detailst == 1 || detailst == 2;
        }
        return item;
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