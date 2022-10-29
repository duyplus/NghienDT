app.controller(
  "index-ctrl",
  ($scope, $rootScope, $window, $cart, $owlSlick) => {
    $scope.removeCartItem = (item) => {
      $cart.removeItem(item.id);
    };

  $scope.$on("viewProduct", (evt, item) => {
    $window.location.href = "/#!product";
    $scope.$broadcast("viewProduct", item);
    });
    $owlSlick.configIndex($scope);
  }
);
