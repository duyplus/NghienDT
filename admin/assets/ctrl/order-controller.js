app.controller("order-ctrl", function ($scope,$timeout, $location, $http, $route, orderService) {
    var url = "http://localhost:8080/api/order";
    var urlOrderApproval = "http://localhost:8080/api/orderdetail/approval";
    var urlOrderDetail = "http://localhost:8080/api/orderdetail";
    var url2 = "http://localhost:8080/api/upload/images";
    $scope.items = [];
    $scope.status = '1';
    $scope.orderdata = orderService.get();
    $scope.itemsApproval = [];
    $scope.isRowCollapsed=true;

    $scope.selectedList = {};
    $scope.itemSelected = {};

    var sweetalert_success = function (text) {
        Swal.fire({
            icon: "success",
            title: text,
            showConfirmButton: false,
            timer: 2000,
        });
    }
    var sweetalert_error = function (text) {
        Swal.fire({
            icon: "error",
            title: text,
            showConfirmButton: false,
            timer: 2000,
        });
    }

    $scope.loadOrderApproval = function () {
    $http.get(`${urlOrderApproval}/${$scope.status}`).then(resp => {
        $scope.itemsApproval = resp.data;
        // paginate
        $scope.curPage = 1;
        $scope.itemsPerPage = 10;
        $scope.maxSize = 5;
        this.items = $scope.itemsApproval;
        $scope.numOfPages = function () {
            return Math.ceil($scope.itemsApproval.length / $scope.itemsPerPage);
        };
        $scope.$watch('curPage + numPerPage', function () {
            var begin = (($scope.curPage - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;
            $scope.filteredItemsApproval = $scope.itemsApproval.slice(begin, end);
        });
    });
    }
    //load order by status
    $scope.loadOrderbyStatus = function () {
        $scope.loadOrderApproval();
    }

    //load order detail
    $http.get(urlOrderDetail).then(resp => {
        $scope.itemDetail = resp.data;
    });

    //load data order
    $http.get(url).then(resp => {
        $scope.items = resp.data;
        // paginate
        $scope.curPage = 1;
        $scope.itemsPerPage = 10;
        $scope.maxSize = 5;
        this.items = $scope.items;
        $scope.numOfPages = function () {
            return Math.ceil($scope.items.length / $scope.itemsPerPage);
        };
        $scope.$watch('curPage + numPerPage', function () {
            var begin = (($scope.curPage - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;
            $scope.filteredItems = $scope.items.slice(begin, end);
        });
    });

    //Duyệt đơn
    $scope.submit = function () {
        angular.forEach($scope.selectedList, function (selected, itemid) {
            if (selected) {
                $http.get(`${urlOrderDetail}/${itemid}`).then(resp => {
                    $scope.itemSelected = resp.data;
                    var item = $scope.itemSelected;
                    item.status = 2;
                    $http.put(`${urlOrderDetail}/${itemid}`, item).then(resp => {
                        sweetalert_success("Cập nhật sản phẩm thành công!");
                        $timeout($route.reload, 2000);
                    })
                })
            }
        });
        
    };
    
    //xoa form
    $scope.reset = function () {
        $scope.orderdata = {};
    }

    //hien thi len form
    $scope.detail = function (item) {
        orderService.set(item);
    }

    //them sp moi
    $scope.create = function () {
        $scope.orderdata.createdAt = new Date().toJSON();
        $scope.orderdata.updatedAt = new Date().toJSON();
        $scope.orderdata.discount = 12;
        $scope.orderdata.image = "null.png";
        $scope.orderdata.Company = $scope.company[$scope.orderdata.Company.id];
        $scope.orderdata.Category = $scope.cate[$scope.orderdata.Category.id];
        var item = angular.copy($scope.orderdata);
        $http.post(`${url}`, item).then(resp => {
            $scope.items.push(resp.data);
            $scope.reset();
            sweetalert_success("Thêm mới thành công!");
            $location.path('order-list');
        }).catch(error => {
            sweetalert_error("Lỗi thêm mới sản phẩm!");
            console.log("Error", error);
        });
    }

    //cap nhat sp
    $scope.update = function () {
        $scope.orderdata.updatedat = new Date().toJSON();
        var item = angular.copy($scope.orderdata);
        $http.put(`${url}/${item.id}`, item).then(resp => {
            var index = $scope.items.findIndex(p => p.id == item.id);
            $scope.items[index] = item;
            $scope.reset();
            sweetalert_success("Cập nhật sản phẩm thành công!");
            $location.path('order-list');
        }).catch(error => {
            sweetalert_error("Lỗi cập nhật sản phẩm!");
            console.log("Error", error);
        });
    }

    //xoa sp
    $scope.delete = function (item) {
        $http.delete(`${url}/${$scope.orderdata.id}`).then(resp => {
            var index = $scope.items.findIndex(p => p.id == $scope.orderdata.id);
            $scope.items.splice(index, 1);
            $scope.reset();
            sweetalert_success("Xóa sản phẩm thành công!");
            $location.path('order-list');
        }).catch(error => {
            sweetalert_error("Lỗi xóa sản phẩm!");
            console.log("Error", error);
        });
    }

    //upload hinh
    $scope.imageChanged = function (files) {
        var data = new FormData();
        data.append('file', files[0]);
        $http.post(url2, data, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(resp => {
            $scope.orderdata.image = resp.data.image;
        }).catch(error => {
            sweetalert("Lỗi tải lên hình ảnh!");
            console.log("Error", error);
        })
    }

    // Export xcel
    $(document).ready(function () {
        $("#saveAsExcel").click(function () {
            var workbook = XLSX.utils.book_new();
            var worksheet_data = document.getElementById("table");
            var worksheet = XLSX.utils.table_to_sheet(worksheet_data);

            workbook.SheetNames.push("order");
            workbook.Sheets["order"] = worksheet;
            exportExcelFile(workbook);
        });
    })
    function exportExcelFile(workbook) {
        return XLSX.writeFile(workbook, "order_List.xlsx");
    }
})
.directive('dir', function() {
    return {
        link: function(scope, elem, attrs) {
            $(elem).on('click', function() {
               $(this)
               .parent('tr')
               .next('tr')
               .toggle();
            })   
        }
    }
});