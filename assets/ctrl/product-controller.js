app.controller(
  "product-ctrl",
  function ($scope, $location, $templateUrl, $owlSlick) {
    $scope.templateUrl = $templateUrl.getProductTemplates();
    $scope.product = {};
    $scope.$on("viewProduct", (evt, product) => {
      $scope.product = product;
    });
    $owlSlick.configProduct($scope);
  }
);
