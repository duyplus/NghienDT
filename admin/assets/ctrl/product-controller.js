app.controller("product-ctrl", function ($scope, $rootScope, $location, $http, $filter, productService) {
    var url = "http://localhost:8080/api/product";
    var urlcate = "http://localhost:8080/api/category";
    var urlcompany = "http://localhost:8080/api/company";
    var urluser = "http://localhost:8080/api/user";
    var url2 = "http://localhost:8080/api/upload/images";
    $scope.items = [];
    $scope.cate = [];
    $scope.user = [];
    $scope.company = [];
    $scope.productdata = productService.get();
    $scope.getUser = "";
    $scope.getcate = "";
    $scope.getcompany = "";


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

    // Dropify
    $('.dropify').dropify();
    var drEvent = $('.dropify-event').dropify();
    drEvent.on('dropify.beforeClear', function (event, element) {
        return confirm("Do you really want to delete \"" + element.file.name + "\" ?");
    });
    drEvent.on('dropify.afterClear', function (event, element) {
        sweetalert("File deleted!");
    });
    drEvent.on('dropify.errors', function (event, element) {
        sweetalert_error("Has Errors!");
    });

     

    //load category
    $http.get(urlcate).then(resp => {
        $scope.cate = resp.data;
    });

    //load company
    $http.get(urlcompany).then(resp => {
        $scope.company = resp.data;
    });

    //load data
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

    //filter user
    $http.get(urluser).then(resp => {
        $scope.user = resp.data;
    });
    $scope.findUser = function(){
        $scope.filterUser = $scope.user.filter(function(item) {
            return item.username === $scope.getUser;
          })[0];
          console.log($scope.productdata.user);
    }
    
    //xoa form
    $scope.reset = function () {
        $scope.productdata = {};
    }

    //hien thi len form
    $scope.edit = function (item) {
        productService.set(item);
    }

    //them sp moi
    $scope.create = function () {
        $scope.productdata.createdAt = new Date().toJSON();
        $scope.productdata.updatedAt = new Date().toJSON();
        $scope.productdata.discount = 12;
        $scope.productdata.image = "null.png";
        $scope.productdata.user = $scope.filterUser;
        $scope.productdata.company = $scope.company[$scope.productdata.company];
        $scope.productdata.category = $scope.cate[$scope.productdata.category];
         // $scope.productdata.company = urlcompany +"/"+$scope.getcompany
        // $scope.productdata.cate = urlcate +"/"+$scope.getcate
        var item = angular.copy($scope.productdata);
        $http.post(`${url}`, item).then(resp => {
            $scope.items.push(resp.data);
            $scope.reset();
            sweetalert_success("Thêm mới thành công!");
            $location.path('product-list');
        }).catch(error => {
            sweetalert_error("Lỗi thêm mới sản phẩm!");
            console.log("Error", error);
        });
    }

    //cap nhat sp
    $scope.update = function () {
        $scope.productdata.updatedat = new Date().toJSON();
        var item = angular.copy($scope.productdata);
        $http.put(`${url}/${item.id}`, item).then(resp => {
            var index = $scope.items.findIndex(p => p.id == item.id);
            $scope.items[index] = item;
            $scope.reset();
            sweetalert_success("Cập nhật sản phẩm thành công!");
            $location.path('product-list');
        }).catch(error => {
            sweetalert_error("Lỗi cập nhật sản phẩm!");
            console.log("Error", error);
        });
    }

    //xoa sp
    $scope.delete = function (item) {
        $http.delete(`${url}/${$scope.productdata.id}`).then(resp => {
            var index = $scope.items.findIndex(p => p.id == $scope.productdata.id);
            $scope.items.splice(index, 1);
            $scope.reset();
            sweetalert_success("Xóa sản phẩm thành công!");
            $location.path('product-list');
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
            $scope.productdata.image = resp.data.image;
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

            workbook.SheetNames.push("Product");
            workbook.Sheets["Product"] = worksheet;
            exportExcelFile(workbook);
        });
    })
    function exportExcelFile(workbook) {
        return XLSX.writeFile(workbook, "Product_List.xlsx");
    }
});