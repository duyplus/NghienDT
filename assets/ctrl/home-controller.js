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
