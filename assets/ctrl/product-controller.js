app.controller(
  "product-ctrl",
  function ($scope, $location, $template, $owlSlick) {
    $scope.templateUrl = $template.getProductTemplates();
    $scope.product = {};
    $scope.$on("viewProduct", (evt, product) => {
      $scope.product = product;
    });
    $owlSlick.configProduct($scope);
  }
);
