var app = angular.module("app", []);

app.controller("ctrl", function ($scope, $http) {
    var url = "http://localhost:8082/rest/images";
    $scope.items = [];
    $scope.imgdata1 = {};

    //load data
    $http.get(url).then((result) => {
        $scope.items = result.data;
    })

    //xoa form
    $scope.reset = function () {
        $scope.imgdata1 = {};
        const getdiv = document.getElementById("myDIV");
        while (getdiv.hasChildNodes()) {
            getdiv.removeChild(getdiv.firstChild);
        }
    }

    //hien thi len form
    $scope.edit = function (item) {
        const getdiv = document.getElementById("myDIV");
        var item1 = angular.copy($scope.items[item])
        $scope.imgdata1 = item1;
        while (getdiv.hasChildNodes()) {
            getdiv.removeChild(getdiv.firstChild);
        }
        setTimeout(() => { $scope.updateImg() }, 1000)
    }

    $scope.updateImg = () => {
        var listImg = document.getElementById("imgs").value.split(',');
        // setTimeout(() => {
        for (let index = 0; index < listImg.length; index++) {
            const para = document.createElement("img");
            para.setAttribute("src", listImg[index]);
            para.setAttribute("referrerpolicy", "no-referrer");
            para.style.width = '300px';
            document.getElementById("myDIV").appendChild(para);
        }
        // }, 2000)
    }

    //them moi
    $scope.create = function () {
        $scope.imgdata1.image = document.getElementById("imgs").value
        var item = angular.copy($scope.imgdata1);
        $http.post(`${url}`, item).then(resp => {
            $scope.items.push(resp.data);
            $scope.reset();
        }).catch(error => {
            console.log("Error", error);
        });
    }

    //cap nhat sp
    $scope.update = function () {
        var item = angular.copy($scope.imgdata1);
        $http.put(`${url}/${item.stt}`, item).then(resp => {
            var index = $scope.items.findIndex(p => p.stt == item.stt);
            $scope.items[index] = item;
            $scope.reset();
        }).catch(error => {
            console.log("Error", error);
        });
    }

    //xoa sp
    $scope.delete = function () {
        $http.delete(`${url}/${$scope.imgdata1.stt}`).then(resp => {
            var index = $scope.items.findIndex(p => p.stt == $scope.imgdata1.stt);
            $scope.items.splice(index, 1);
            $scope.reset();
        }).catch(error => {
            console.log("Error", error);
        });
    }

    $('document').ready(function () {
        $('input[type=file]').on('change', function () {
            var $files = $(this).get(0).files;
            if ($files.length) {
                for (let index = 0; index < $files.length; index++) {
                    if ($files[index].size > $(this).data('max-size') * 1024) {
                        console.log('Vui lòng chọn file có dung lượng nhỏ hơn!');
                        return false;
                    }
                }
                console.log('Đang upload hình ảnh lên imgur...');
                const arr = [];
                for (let index = 0; index < $files.length; index++) {
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
                    formData.append('image', $files[index]);
                    settings.data = formData;

                    $.ajax(settings).done(function (response) {
                        console.log('done');
                        var obj = JSON.parse(response);
                        var cut = JSON.stringify(obj.data.link);
                        arr.push(cut.slice(1, cut.length - 1));
                        const para = document.createElement("img");
                        para.setAttribute("src", cut.slice(1, cut.length - 1));
                        para.setAttribute("referrerpolicy", "no-referrer");
                        para.style.width = '300px';
                        document.getElementById("myDIV").appendChild(para);
                    });
                }
                console.log(arr.toString().split(','))
                document.getElementById("imgs").value = arr.toString().split(',')
                console.log(document.getElementById("imgs").value)
            }
        });
    });
});