app.controller("user-ctrl", function ($scope, $rootScope, $location, $http, $filter, myService) {
    var url = "http://localhost:8080/api/user";
    var url2 = "http://localhost:8080/api/upload/images";
    $scope.items = [];
    $scope.userdata = myService.get();

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
        $scope.userdata = {};
    }

    //hien thi len form
    $scope.edit = function (item) {
        myService.set(item);
    }

    //them sp moi
    $scope.create = function () {
        $scope.userdata.createdat = new Date().toJSON();
        $scope.userdata.updatedat = new Date().toJSON();
        // $scope.userdata.image = "avt.png";
        $scope.userdata.token = "null";
        var item = angular.copy($scope.userdata);
        $http.post(`${url}`, item).then(resp => {
            $scope.items.push(resp.data);
            $scope.reset();
            sweetalert_success("Thêm mới thành công!");
            $location.path('user-list');
        }).catch(error => {
            sweetalert_error("Lỗi thêm mới tài khoản!");
            console.log("Error", error);
        });
    }

    //cap nhat sp
    $scope.update = function () {
        $scope.userdata.updatedat = new Date().toJSON();
        var item = angular.copy($scope.userdata);
        $http.put(`${url}/${item.id}`, item).then(resp => {
            var index = $scope.items.findIndex(p => p.id == item.id);
            $scope.items[index] = item;
            $scope.reset();
            sweetalert_success("Cập nhật tài khoản thành công!");
            $location.path('user-list');
        }).catch(error => {
            sweetalert_error("Lỗi cập nhật tài khoản!");
            console.log("Error", error);
        });
    }

    //xoa sp
    $scope.delete = function (item) {
        $http.delete(`${url}/${$scope.userdata.id}`).then(resp => {
            var index = $scope.items.findIndex(p => p.id == item.id);
            $scope.items.splice(index, 1);
            $scope.reset();
            sweetalert_success("Xóa tài khoản thành công!");
            $location.path('user-list');
        }).catch(error => {
            sweetalert_error("Lỗi xóa tài khoản!");
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
            $scope.userdata.image = resp.data.image;
        }).catch(error => {
            sweetalert("Lỗi tải lên hình ảnh!");
            console.log("Error", error);
        })
    }

    ///////
    $('document').ready(function () {
        $('input[type=file]').on('change', function () {
            var $files = $(this).get(0).files;
            if ($files.length) {
                if ($files[0].size > $(this).data('max-size') * 1024) {
                    console.log('Vui lòng chọn file có dung lượng nhỏ hơn!');
                    return false;
                }
                console.log('Đang upload hình ảnh lên imgur...');

                var apiUrl = 'https://api.imgur.com/3/image';
                var apiKey = '146def7f79c7a87';
                var settings = {
                    async: false,
                    crossDomain: true,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    url: apiUrl,
                    headers: {
                        Authorization: 'Client-ID ' + apiKey,
                        Accept: 'application/json',
                    },
                    mimeType: 'multipart/form-data',
                };

                var formData = new FormData();
                formData.append('image', $files[0]);
                settings.data = formData;

                $.ajax(settings).done(function (response) {
                    console.log('done');
                    var obj = JSON.parse(response);
                    document.getElementById("link").value = JSON.stringify(obj.data.link);
                    console.log(JSON.stringify(obj.data.link))
                });
            }
        });
        
        $('input[name="link"]').change(function() {
            $('input[name="img"]').val($(this).val());
        });

        $(function () {
            var $link = $('#link');
            var $img = $('#img');
            function onChange() {
                $img.val($link.val());
            };
            $('#link').change(onChange).keyup(onChange);
        });
    });
});