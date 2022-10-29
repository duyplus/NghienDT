app.controller(
  "home-ctrl",
  function ($scope, $rootScope, $data, $cart, $template) {
    $scope.templateUrl = $template.getHomeTemplates();
    $data.fetch("categories", $scope);
    $data.fetch("products", $scope);
    $scope.addCart = (product) => {
      $cart.addItem(product);
    };
    $scope.viewProduct = (product) => {
      $scope.$emit("viewProduct", product);
    };
  }
);
