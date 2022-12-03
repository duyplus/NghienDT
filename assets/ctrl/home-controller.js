app.controller("home-ctrl", function ($scope, $cart, $product, $utility) {
    const { $data, $url, $templateUrl } = $utility;

    function numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    $scope.templateUrl = $templateUrl.getHomeTemplates();
    fetchData("categories", "products", "banners", "featuredProducts");

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
