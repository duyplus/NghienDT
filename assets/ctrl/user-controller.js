app.controller("user-ctrl", function ($scope, $location, $utility) {
    const { $http, $data, $serverUrl, $message } = $utility;
    var url = "http://localhost:8080/api/user";
    $scope.items = [];
    $scope.userdata = {};
    // $scope.id = 4;
    $scope.email = "";

    $http.get(url).then((resp) => {
        $scope.items = resp.data;
        $scope.userdata = $scope.items[$scope.id];
    });
    
    $scope.reset = function () {
        $scope.userdata = {};
    };

    $scope.update = function () {
        var item = angular.copy($scope.userdata);
        $http.put(`${url}/${item.id}`, item).then((resp) => {
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
