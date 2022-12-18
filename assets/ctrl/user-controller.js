"use strict";
app.controller("user-ctrl", function ($scope, $rootScope, $location, $utility, HOST, userService, authService) {
    const { $http, $data, $serverUrl, $message } = $utility;

    var urlProd = "http://localhost:8080/api/product";
    $scope.items = [];
    $scope.userdata = {};

    $scope.id = "";
    $scope.username = "";
    $scope.password = "";
    $scope.email = "";
    $scope.phone = "";
    $scope.fullname = "";

    $scope.cates = [];
    $scope.companys = [];
    $scope.products = []
    $scope.product = {};
    $scope.productByUserId = [];

    $scope.cate = {};
    $scope.company = {};

    var sweetalert_error = function (text) {
        Swal.fire({
            icon: "error",
            title: text,
            showConfirmButton: false,
            timer: 2000,
        });
    }

    var sweetalert_success = function (text) {
        Swal.fire({
            icon: "success",
            title: text,
            showConfirmButton: false,
            timer: 2000,
        });
    }

    $http.get(HOST + "/api/user").then((resp) => {
        $scope.items = resp.data;
    });

    $http.get(HOST + "/api/category").then((resp) => {
        $scope.cates = resp.data;
        $scope.st = $scope.cates[0];
        $scope.product.category = $scope.st.id;
    });

    $http.get(HOST + "/api/company").then((resp) => {
        $scope.companys = resp.data;
        $scope.st = $scope.companys[0];
        $scope.product.company = $scope.st.id;
    });

    $http.get(HOST + "/api/product").then((resp) => {
        $scope.products = resp.data;
    });

    function handleRequest(res) {
        var token = res.data ? res.data.token : null;
        if (token) {
            console.log("JWT: ", token);
            $rootScope.currentUser = localStorage.setItem("currentUser", $scope.username);
        }
        $scope.message = res.data.message;
    }

    $scope.edit = function (item) {
        $scope.index = true;
        console.log($scope.index);
        var item1 = angular.copy(item);
        $scope.product = item1;
        $scope.product.category = (item1.category.id)
        $scope.product.company = (item1.company.id)
        $scope.moveTabAddProd();
        // * Delete all element in class "myDIV"
        setTimeout(() => {
            const getdiv = document.getElementById("myDIV");
            getdiv.innerHTML = "";
        }, 1000)
        // * After 1s, function updateImg() is execute
        setTimeout(() => { $scope.updateImg() }, 1000)
    }

    $scope.loadNameLogin = () => {
        if (authService.isAuthed ? authService.isAuthed() : false) {
            setTimeout(() => {
                $scope.product.user = $scope.items.filter(function (item) {
                    return item.username === localStorage.getItem('currentUser');
                })[0];
                var un = $scope.product.user;
                $("#nameUser").html("<b>" + un.username + "</b>");
                $("#nameUser1").text(un.username);
                $scope.userdata = un;
                $scope.userdata.password = "";

                $scope.findProd();
            }, 1000)
        }
    }

    $scope.findProd = function () {
        $scope.productByUserId = $scope.products.filter(item => {
            return item.user.id === $scope.userdata.id;
        });
        const i1 = $scope.productByUserId;
        for (let index = 0; index < i1.length; index++) {
            // console.log(i1[index].image);
        }
    }

    $scope.moveTabMyProd = () => {
        $("#dashboard-tab").attr("class", "nav-link active");
        $("#add-tab").attr("class", "nav-link");
        $("#dashboard").attr("class", "tab-pane fade show active");
        $("#add").attr("class", "tab-pane fade show");
    }

    $scope.moveTabAddProd = () => {
        $("#dashboard-tab").attr("class", "nav-link");
        $("#add-tab").attr("class", "nav-link active");
        $("#dashboard").attr("class", "tab-pane fade show");
        $("#add").attr("class", "tab-pane fade show active");
    }

    $scope.login = function () {
        userService
            .login($scope.username, $scope.password)
            .then(handleRequest, handleRequest);
        $location.path("/");
    };

    $scope.register = function () {
        userService
            .register($scope.username, $scope.password, $scope.fullname, $scope.phone, $scope.email)
            .then(handleRequest, handleRequest);
        $location.path("/login");
    };

    $scope.logout = function () {
        authService.logout && authService.logout();
    };

    $scope.isAuthed = function () {
        return authService.isAuthed ? authService.isAuthed() : false;
    };

    $scope.reset = function () {
        $scope.index = false;
        console.log($scope.index);
        $scope.product = {};
        $scope.product.category = 1;
        $scope.product.company = 1;

        // * Delete all element in class "myDIV"
        setTimeout(() => {
            const getdiv = document.getElementById("myDIV");
            getdiv.innerHTML = "";
        }, 1000)
    };

    $scope.updateInfo = function () {
        var datetime = new Date();
        $scope.userdata.updatedat = moment(datetime).format("YYYY-MM-DD HH:mm");
        var item = angular.copy($scope.userdata);
        console.log("id:" + item.id);
        $http.put(`${HOST}/api/user/${item.id}`, item).then((resp) => {
            var index = $scope.items.findIndex((p) => p.id == item.id);
            $scope.items[index] = item;
            $scope.reset();
            sweetalert_success("Cập nhật thông tin thành công!!")
            $location.path("my-account");
        }).catch((error) => {
            console.log("Error", error);
            sweetalert_error("Cập nhật thông tin thất bại!")
        });
    };

    $scope.forgotPassword = (evt) => {
        evt.preventDefault();
        const { success, error } = $message.mail;
        const url = $serverUrl.forgotPasswordUrl;

        $http.post(url, $scope.email).then(() => {
            sweetalert_success(success.RESET_PASSWORD());
        }).catch((err) => {
            const { status, data } = err;
            sweetalert_error(error.RESET_PASSWORD(status, data && data.message));
            if (status === 500) $scope.email = "";
        });
    };

    // Create Product
    $scope.createProd = () => {
        $scope.product.createdAt = moment().format('YYYY-MM-DD HH:mm');
        $scope.product.updatedAt = moment().format('YYYY-MM-DD HH:mm');
        $scope.product.category = $scope.cates[$scope.product.category - 1];
        $scope.product.company = $scope.companys[$scope.product.company - 1];
        $scope.product.image = document.getElementById("imgs").value;
        $scope.product.discount = 0;
        $scope.product.available = false;

        var item = angular.copy($scope.product);
        console.log(item)
        $http.post(`${urlProd}`, item).then(resp => {
            $scope.products.push(resp.data);
            $scope.reset();
            $scope.moveTabMyProd();
            sweetalert_success("Đã thêm sản phẩm vào hệ thống!")
        }).catch(err => {
            sweetalert_error("Thêm sản phẩm thất bại!")
        })
    };

    //cap nhat san pham
    $scope.updateProd = function () {
        $scope.product.updatedat = moment().format('YYYY-MM-DD HH:mm');
        $scope.product.company = $scope.companys[$scope.product.company - 1];
        $scope.product.category = $scope.cates[$scope.product.category - 1];
        $scope.product.discount = 0;
        $scope.product.available = false;

        // * Get img
        $scope.product.image = document.getElementById("imgs").value;

        var item = angular.copy($scope.product);
        $http.put(`${urlProd}/${item.id}`, item).then(resp => {
            var index = $scope.products.findIndex(p => p.id == item.id);
            $scope.products[index] = item;
            $scope.reset();
            sweetalert_success("Cập nhật sản phẩm thành công!");
        }).catch(error => {
            sweetalert_error("Lỗi cập nhật sản phẩm!");
            console.log("Error", error);
        });
    }

    // xoa san pham
    $scope.deleteProd = function (item) {
        console.log(item)
        $http.delete(`${urlProd}/${item.id}`).then(resp => {
            var index = $scope.products.findIndex(p => p.id == $scope.product.id);
            $scope.products.splice(index, 1);
            $scope.reset();
            sweetalert_success("Xóa sản phẩm thành công!");
            location.reload();
        }).catch(error => {
            sweetalert_error("Lỗi xóa sản phẩm!");
            console.log("Error", error);
        });
    }

    // list IMG
    $scope.updateImg = () => {
        var listImg = document.getElementById("imgs").value.split(',');
        for (let index = 0; index < listImg.length; index++) {
            const outImg = document.createElement("div");
            outImg.setAttribute("class", "outImg")
            const img = document.createElement("img");
            img.setAttribute("src", listImg[index]);
            img.setAttribute("ondblclick", `angular.element(this).scope().deleteImg(` + index + `)`);
            img.setAttribute("referrerpolicy", "no-referrer");
            img.style.width = '300px';
            outImg.appendChild(img);
            document.getElementById("myDIV").appendChild(outImg);
        }
    }

    // Upload IMG to imgur api
    $('document').ready(function () {
        $('input[type=file]').on('change', function () {
            var $files = $(this).get(0).files;
            const getdiv = document.getElementById("myDIV");
            getdiv.innerHTML = "";
            if ($files.length) {
                for (let index = 0; index < $files.length; index++) {
                    if ($files[index].size > $(this).data('max-size') * 1024) {
                        return false;
                    }
                }
                document.getElementById("imgs").value = '';
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
                        const outImg = document.createElement("div");
                        outImg.setAttribute("class", "outImg")
                        const img = document.createElement("img");
                        img.setAttribute("src", cut.slice(1, cut.length - 1));
                        img.setAttribute("ondblclick", `angular.element(this).scope().deleteImg(` + index + `)`);
                        img.setAttribute("referrerpolicy", "no-referrer");
                        img.style.width = '300px';
                        outImg.appendChild(img);
                        document.getElementById("myDIV").appendChild(outImg);
                    });
                }
                document.getElementById("imgs").value = arr.toString().split(',')
            }
        });
    });
});

app.controller("reset-password-ctrl", function ($scope, $utility) {
    const { $http, $serverUrl, $params, $url, $message } = $utility;
    $scope.forgotUser = {};
    const url = $serverUrl.resetPasswordUrl;
    const token = $params.token;

    if (!token) $url.redirectToHomePage();
    $http.get(url, { params: { token: token } }).then((resp) => {
        $scope.forgotUser = resp.data;
    }).catch((err) => {
        console.log(err);
        $url.redirectToHomePage();
    });

    $scope.changePassword = () => {
        const { id, password, confirm } = $scope.forgotUser;
        const { success, error } = $message.user;

        if (!id || !password || !confirm || password !== confirm) {
        } else {
            $http.post(url, $scope.forgotUser).then((resp) => {
                sweetalert_success(success.CHANGE_PASSWORD());
                $url.redirectToLoginPage();
            }).catch((err) => {
                sweetalert_error(error.CHANGE_PASSWORD());
            });
        }
    };
});
