app.controller("category-ctrl", function ($scope, $rootScope, $location, $http, $filter, cateService) {
    var url = "http://localhost:8080/api/category";
    var url2 = "http://localhost:8080/api/upload/images";
    $scope.items = [];
    $scope.categorydata = cateService.get();

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
        $scope.categorydata = {};
    }

    //hien thi len form
    $scope.edit = function (item) {
        cateService.set(item);
    }

    //them sp moi
    $scope.create = function () {
        $scope.categorydata.image = "null.png";
        var item = angular.copy($scope.categorydata);
        $http.post(`${url}`, item).then(resp => {
            $scope.items.push(resp.data);
            $scope.reset();
            sweetalert_success("Thêm mới thành công!");
            $location.path('category-list');
        }).catch(error => {
            sweetalert_error("Lỗi thêm mới hãng!");
            console.log("Error", error);
        });
    }

    //cap nhat sp
    $scope.update = function () {
        var item = angular.copy($scope.categorydata);
        $http.put(`${url}/${item.id}`, item).then(resp => {
            var index = $scope.items.findIndex(p => p.id == item.id);
            $scope.items[index] = item;
            $scope.reset();
            sweetalert_success("Cập nhật hãng thành công!");
            $location.path('category-list');
        }).catch(error => {
            sweetalert_error("Lỗi cập nhật hãng!");
            console.log("Error", error);
        });
    }

    //xoa sp
    $scope.delete = function () {
        $http.delete(`${url}/${$scope.categorydata.id}`).then(resp => {
            var index =$scope.items.findIndex(p => p.id == $scope.categorydata.id);
            $scope.items.splice(index, 1);
            $scope.reset();
            sweetalert_success("Xóa hãng thành công!");
            $location.path('category-list');
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
            $scope.categorydata.image = resp.data.image;
        }).catch(error => {
            sweetalert("Lỗi tải lên hình ảnh!");
            console.log("Error", error);
        })
    }
});