app.controller("index-ctrl", ($scope, $http, $cart, $utility) => {
	const { $owlSlick } = $utility;
	var cate = "http://localhost:8080/api/category";
	var brand = "http://localhost:8080/api/category";
	$scope.cates = [];
	$scope.brands = [];

	$http.get(cate).then(resp => {
		$scope.cates = resp.data;
	});

	$http.get(brand).then(resp => {
		$scope.brands = resp.data;
	});

	$owlSlick.configIndex($scope);

	$scope.removeCartItem = (item) => {
		$cart.removeItem(item.id);
	};
});
