var app = angular.module("app", []);


app.factory('imgService', function () {
    var savedData = {}
    function set(data) {
        savedData = data;
    }
    function get() {
        return savedData;
    }
    return {
        set: set,
        get: get
    }
});

app.controller("ctrl", function ($scope, $http, imgService, $interval) {
    // var url = `http://localhost:8082/rest/files/images`
    // $scope.url = function (filename) {
    //     return `${url}/${filename}`;
    // }

    // $scope.list = function () {
    //     $http.get(url).then((result) => {
    //         $scope.filenames = result.data;
    //     }).catch((err) => {
    //         console.log("Error", err)
    //     });
    // }

    // $scope.nameFile = function (e) {
    //     for (let index = 0; index < e.length; index++) {
    //         console.log(e[index].name);
    //         document.getElementById("img-text").innerText = e[index].name;
    //     }
    //     var arrM = [...e];
    //     var arm = arrM.map(function (ele, index) {
    //         return `${ele.name}`
    //     })
    //     console.log(arm.join(","))
    // }

    // $scope.upload = function (files) {
    //     var form = new FormData();
    //     for (var i = 0; i < files.length; i++) {
    //         form.append("files", files[i]);
    //     }

    //     $http.post(url, form, {
    //         transformRequest: angular.identity,
    //         headers: { 'Content-Type': undefined }
    //     }).then((result) => {
    //         $scope.filenames.push(...result.data);
    //         $scope.list();
    //     }).catch((err) => {
    //         console.log("Errors1", err)
    //     });
    //     // $scope.nameFile(files);
    //     // console.log(Date.now())
    // }

    // $scope.delete = function (filename) {
    //     $http.delete(`${url}/${filename}`).then((result) => {
    //         let i = $scope.filenames.findIndex(name => name == filename);
    //         $scope.filenames.splice(i, 1);
    //         $scope.list();
    //     }).catch((err) => {
    //         console.log("Error", err)
    //     });
    //     // $scope.nameFile();
    // }
    // //
    // $scope.list();

    var url = "http://localhost:8082/rest/images";
    $scope.items = [];
    $scope.imgdata1 = imgService.get();

    //load data
    $http.get(url).then((result) => {
        $scope.items = result.data;
    }).catch((err) => {
        console.log("Error", err)
    })

    //xoa form
    $scope.reset = function () {
        $scope.imgdata1 = {};
    }

    //hien thi len form
    $scope.edit = function (item) {
        $scope.imgdata = angular.copy($scope.items[item])
        imgService.set($scope.imgdata)
        $scope.imgdata1 = imgService.get()
        $scope.updateImg();
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

    // $scope.changeImg = function () {
    //     document.getElementById("img").value = $scope.imgdata1.image
    // }

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
    $scope.updateImg = () => {
        var listImg = document.getElementById("imgs").value.split(',');
        for (let index = 0; index < listImg.length; index++) {
            const para = document.createElement("img");
            para.setAttribute("src", listImg[index]);
            para.setAttribute("referrerpolicy", "no-referrer");
            para.style.width = '300px';
            document.getElementById("myDIV").appendChild(para);
        }
    }

    // Load n images
    // if (document.getElementById("imgs").value == "") {
    //     console.log("Loading images...");
    // } else {

    //     console.log("Imag")
    // }
    // console.log(document.getElementById("imgs").value)
});