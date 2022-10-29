app.controller("home-ctrl", function ($scope, $rootScope, $data, $cart) {
  $scope.templateUrl = getTemplateUrl();
  $data.fetch("categories", $scope);
  $data.fetch("products", $scope);
  $scope.addCart = (product) => {
    $cart.addItem(product);
  };
  $scope.viewProduct = (product) => {
    $scope.$emit("viewProduct", product);
  };

  function getTemplateUrl() {
    const templatePath = "pages/home";
    return {
      slider: `${templatePath}/slider.html`,
      features: `${templatePath}/features.html`,
      products: `${templatePath}/products.html`,
      featuredProducts: `${templatePath}/featured-product.html`,
      productsByCategory: `${templatePath}/product-by-category.html`,
      bannerTop: `${templatePath}/banner-top.html`,
      bannerMiddle: `${templatePath}/banner-middle.html`,
      bannerBottom: `${templatePath}/banner-bottom.html`,
    };
  }
});
