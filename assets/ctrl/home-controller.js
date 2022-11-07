app.controller("home-ctrl", function ($scope, $cart, $product, $utility) {
    const { $data, $url, $templateUrl } = $utility;

    $scope.templateUrl = $templateUrl.getHomeTemplates();
    fetchData("categories", "products");

    $scope.addCart = (product) => {
        $cart.addItem(product);
    };

    $scope.viewProduct = (event, product) => {
        event.preventDefault();
        $product.current = product;
        $url.redirectToProductPage();
    };

    function fetchData(...names) {
        names.forEach((name) => $data.fetch($scope, { name: name }));
    }
});
