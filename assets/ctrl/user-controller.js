app.controller('user-ctrl', function ($scope, $http, $location) {
    var url = "http://localhost:8080/api/user";
    $scope.items = [];
    $scope.userdata = {};
    $scope.id = 4;

    $http.get(url).then(resp => {
        $scope.items = resp.data;
        $scope.userdata = $scope.items[$scope.id];
    });

    $scope.reset = function () {
        $scope.userdata = {};
    }

    $scope.update = function () {
        var item = angular.copy($scope.userdata);
        $http.put(`${url}/${item.id}`, item).then(resp => {
            var index = $scope.items.findIndex(p => p.id == item.id);
            $scope.items[index] = item;
            $scope.reset();
            $location.path('my-account');
        }).catch(error => {
            console.log("Error", error);
        });
    }

    $scope.btnEdit = () => {
        var btn = document.getElementById("add-tab")
        btn.className = "nav-link actice";
        alert(btn.className)
        var tab = document.getElementById("add")
        tab.className = "tab-pane fade show actice";
        alert(tab.className)
    }

    $("#btnEdit").click(() => {
        $("#add").attr("class", "tab-pane fade show active")
        $("#dashboard").attr("class", "tab-pane fade")
        $("#add-tab").attr("class", "nav-link active")
        $("#dashboard-tab").attr("class", "nav-link")
        $("#add-tab").attr("aria-selected", "true")
        $("#dashboard-tab").attr("aria-selected", "false")
    })
});