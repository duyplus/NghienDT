var app = angular.module("app", []);
app.controller("ctrl", function ($scope, $http) {
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

    $('document').ready(function () {
        $('input[type=file]').on('change', function () {
            const img = [];
            var $files = $(this).get(0).files;
            if ($files.length) {
                for (let index = 0; index < $files.length; index++) {
                    if ($files[index].size > $(this).data('max-size') * 1024) {
                        console.log('Vui lòng chọn file có dung lượng nhỏ hơn!');
                        return false;
                    }
                }
                console.log('Đang upload hình ảnh lên imgur...');

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
                        img.push(cut.slice(1, cut.length - 1));
                    });
                }
            }
            img.forEach(element => {
                const para = document.createElement("img");
                para.setAttribute("src", element);
                para.setAttribute("referrerpolicy", "no-referrer");
                para.style.width = '300px';
                document.getElementById("myDIV").appendChild(para);
            });
        });
    });
})