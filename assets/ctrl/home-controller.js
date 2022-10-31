<<<<<<< HEAD
app.controller(
  "home-ctrl",
  function ($scope, $rootScope, $data, $cart, $templateUrl) {
    $scope.templateUrl = $templateUrl.getHomeTemplates();
    $data.fetch($scope, { name: "categories" });
    $data.fetch($scope, { name: "products" });
    $scope.addCart = (product) => {
      $cart.addItem(product);
    };
    $scope.viewProduct = (product) => {
    $scope.$emit("viewProduct", product);
    };
  }
);
=======
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
>>>>>>> 5d42187 (Hiển thị thông tin sản phẩm details và refractor  service)
