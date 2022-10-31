app.controller("index-ctrl", ($scope, $cart, $utility) => {
  const { $owlSlick } = $utility;

  $owlSlick.configIndex($scope);

  $scope.removeCartItem = (item) => {
    $cart.removeItem(item.id);
  };
});
