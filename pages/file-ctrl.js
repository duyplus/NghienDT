var app = angular.module("app", []);
app.controller("ctrl", function ($scope, $http) {
    var url = `http://localhost:8080/rest/files/images`
    $scope.url = function (filename) {
        return `${url}/${filename}`;
    }

    $scope.list = function () {
        $http.get(url).then((result) => {
            $scope.filenames = result.data;
        }).catch((err) => {
            console.log("Error", err)
        });
    }

    $scope.nameFile = function (e) {
        for (let index = 0; index < e.length; index++) {
            console.log(e[index].name);
            document.getElementById("img-text").innerText = e[index].name;
        }
        var arrM = [...e];
        var arm = arrM.map(function (ele, index) {
            return `${ele.name}`
        })
        console.log(arm.join(","))
    }

    $scope.upload = function (files) {
        var form = new FormData();
        for (var i = 0; i < files.length; i++) {
            form.append("files", files[i]);
        }

        $http.post(url, form, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then((result) => {
            $scope.filenames.push(...result.data);
            $scope.list();
        }).catch((err) => {
            console.log("Errors1", err)
        });
        // $scope.nameFile(files);
        // console.log(Date.now())
    }

    $scope.delete = function (filename) {
        $http.delete(`${url}/${filename}`).then((result) => {
            let i = $scope.filenames.findIndex(name => name == filename);
            $scope.filenames.splice(i, 1);
            $scope.list();
        }).catch((err) => {
            console.log("Error", err)
        });
        // $scope.nameFile();
    }
    //
    $scope.list();
})