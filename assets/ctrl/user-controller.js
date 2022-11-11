"use strict";
app.controller("user-ctrl", function ($scope, $rootScope, $location, $utility, HOST, userService, authService) {
    const { $http, $data, $serverUrl, $message } = $utility;
    $scope.items = [];
    $scope.userdata = {};
    $scope.id = "";
    $scope.username = "";
    $scope.password = "";
    $scope.email = "";
    $scope.phone = "";
    $scope.fullname = "";

    $http.get(HOST + "/api/user").then((resp) => {
        $scope.items = resp.data;
    });

    function handleRequest(res) {
        var token = res.data ? res.data.token : null;
        if (token) {
            console.log("JWT: ", token);
            $rootScope.currentUser = localStorage.setItem("currentUser", $scope.username);
        }
        $scope.message = res.data.message;
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
        $scope.userdata = {};
    };

    $scope.updateInfo = function () {
        var item = angular.copy($scope.userdata);
        $http.put(`${HOST}/api/user/${item.id}`, item).then((resp) => {
            var index = $scope.items.findIndex((p) => p.id == item.id);
            $scope.items[index] = item;
            $scope.reset();
            $location.path("my-account");
        }).catch((error) => {
            console.log("Error", error);
        });
    };

    $scope.forgotPassword = (evt) => {
        evt.preventDefault();
        const { success, error } = $message.mail;
        const url = $serverUrl.forgotPasswordUrl;

        $http.post(url, $scope.email).then(() => {
            alert(success.RESET_PASSWORD());
        }).catch((err) => {
            const { status, data } = err;
            alert(error.RESET_PASSWORD(status, data && data.message));
            if (status === 500) $scope.email = "";
        });
    };
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
                alert(success.CHANGE_PASSWORD());
                $url.redirectToLoginPage();
            }).catch((err) => {
                alert(error.CHANGE_PASSWORD());
            });
        }
    };
});
