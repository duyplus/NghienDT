<<<<<<< HEAD
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
=======
app.controller("index-ctrl", ($scope, $cart, $utility) => {
  const { $owlSlick } = $utility;

  $owlSlick.configIndex($scope);

  $scope.removeCartItem = (item) => {
    $cart.removeItem(item.id);
  };
});
>>>>>>> 5d42187 (Hiển thị thông tin sản phẩm details và refractor  service)
