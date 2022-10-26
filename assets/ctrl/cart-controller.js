app.controller("cart-ctrl", function ($scope, $rootScope, $location, $http) {
  $scope.removeItem = (item) => {
    $scope.$emit("removeCartItem", item);
  };
});
