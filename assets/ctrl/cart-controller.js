app.controller(
  "cart-ctrl",
  function ($scope, $rootScope, $location, $http, $cart) {
    $scope.removeItem = (item) => {
      console.log("hello removing item", item.id);
      $cart.removeItem(item.id);
    };
  }
);
