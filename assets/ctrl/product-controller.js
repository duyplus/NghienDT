<<<<<<< HEAD
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
=======
app.controller("product-ctrl", function ($scope, $product, $cart, $utility) {
  const { $message, $templateUrl, $owlSlick } = $utility;

  $scope.templateUrl = $templateUrl.getProductTemplates();
  $owlSlick.configProduct($scope);

  const message = $message.product;

  $scope.info = {
    currentProduct: $product.current,
    quantity: 0,
    get cartQuantity() {
      return $cart.getItemQuantity(this.currentProduct.id);
    },
    get maxQuantity() {
      return this.currentProduct.quantity - this.cartQuantity;
    },
  };

  $scope.addToCart = () => {
    const { currentProduct, quantity } = $scope.info;
    $cart.addItem(currentProduct, quantity);
    $scope.info.quantity = 0;
  };

  $scope.$watch("info.quantity", (newVal, oldVal) => {
    const { maxQuantity } = $scope.info;
    if (newVal == 0 && maxQuantity != 0) $scope.info.quantity = 1;
    if (newVal != oldVal && newVal > maxQuantity) {
      $scope.info.quantity = oldVal;
      alert(message.error.OVER_QUANTITY());
    }
  });
});
>>>>>>> 5d42187 (Hiển thị thông tin sản phẩm details và refractor  service)
