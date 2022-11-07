app.controller("index-ctrl", ($scope, $http, $cart, $utility, authService) => {
	const { $owlSlick } = $utility;
	var cate = "https://nghienteam.studio/api/category";
	var brand = "https://nghienteam.studio/api/category";
	$scope.cates = [];
	$scope.brands = [];
	
    $scope.logout = function () {
        authService.logout && authService.logout();
    };

    $scope.isAuthed = function () {
        return authService.isAuthed ? authService.isAuthed() : false;
    };

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
