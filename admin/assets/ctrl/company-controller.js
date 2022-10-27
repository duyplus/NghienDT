app.controller("company-ctrl", function ($scope, $rootScope, $location, $http, $filter, companyService) {
    var url = "http://localhost:8080/api/company";
    var url2 = "http://localhost:8080/api/upload/images";
    $scope.items = [];
    $scope.companydata = companyService.get();

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

    // Summernote
    $('#summernote').summernote({
        height: 200,
        placeholder: 'Nhập thông tin sản phẩm..',
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['view', ['codeview']],
        ]
    });

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

    //xoa form
    $scope.reset = function () {
        $scope.companydata = {};
    }

    //hien thi len form
    $scope.edit = function (item) {
        companyService.set(item);
    }

    //them sp moi
    $scope.create = function () {
        $scope.companydata.logo = "null.png";
        var item = angular.copy($scope.companydata);
        $http.post(`${url}`, item).then(resp => {
            $scope.items.push(resp.data);
            $scope.reset();
            sweetalert_success("Thêm mới thành công!");
            $location.path('company-list');
        }).catch(error => {
            sweetalert_error("Lỗi thêm mới hãng!");
            console.log("Error", error);
        });
    }

    //cap nhat sp
    $scope.update = function () {
        $scope.companydata.logo = "null.png";
        var item = angular.copy($scope.companydata);
        $http.put(`${url}/${item.id}`, item).then(resp => {
            var index = $scope.items.findIndex(p => p.id == item.id);
            $scope.items[index] = item;
            $scope.reset();
            sweetalert_success("Cập nhật hãng thành công!");
            $location.path('company-list');
        }).catch(error => {
            sweetalert_error("Lỗi cập nhật hãng!");
            console.log("Error", error);
        });
    }

    //xoa sp
    $scope.delete = function () {
        $http.delete(`${url}/${$scope.companydata.id}`).then(resp => {
            var index = $scope.items.findIndex(p => p.id == $scope.companydata.id);
            $scope.items.splice(index, 1);
            $scope.reset();
            sweetalert_success("Xóa hãng thành công!");
            $location.path('company-list');
        }).catch(error => {
            sweetalert_error("Lỗi xóa hãng!");
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
            $scope.companydata.image = resp.data.image;
        }).catch(error => {
            sweetalert("Lỗi tải lên hình ảnh!");
            console.log("Error", error);
        })
    }
});