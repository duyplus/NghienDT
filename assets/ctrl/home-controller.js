app.controller("home-ctrl", function ($scope, $rootScope, $location, $http) {
    $scope.items = [];
    fetchData($scope, $http);

    $scope.addCart = function (data) {
        addCart($scope, $rootScope, data);
    };
});

function fetchData(scope, http) {
    let url = "assets/data/products.json";
    http
        .get(url)
        .then((response) => {
            scope.items = response.data;
        })
        .catch((err) => console.log(err));
}

function addCart(scope, rootScope, data) {
    let itemCart = rootScope.cart.map.get(data.id);
    if (!itemCart || itemCart.quantity < Number(data.quantity)) {
        let item = {
            ...data,
            quantity: 1
        };
        scope.$emit("addCart", item);
    } else {
        alert("Đã đạt giới hạn số lượng tối đa");
    }
}