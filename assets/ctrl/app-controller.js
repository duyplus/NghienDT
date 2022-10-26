const app = angular.module("myApp", ["ngRoute", "ui.bootstrap"]);
app.config(function ($routeProvider, $locationProvider) {
  // route
  $routeProvider
    .when("/", { templateUrl: "pages/home.html", controller: "home-ctrl" })
    .when("/shop", { templateUrl: "pages/shop.html", controller: "shop-ctrl" })
    .when("/product", {
      templateUrl: "pages/product.html",
      controller: "product-ctrl",
    })
    .when("/wishlist", {
      templateUrl: "pages/wishlist.html",
      controller: "wishlist-ctrl",
    })
    .when("/cart", { templateUrl: "pages/cart.html", controller: "cart-ctrl" })
    .when("/checkout", {
      templateUrl: "pages/checkout.html",
      controller: "checkout-ctrl",
    })

    .when("/my-account", {
      templateUrl: "pages/my-account.html",
      controller: "user-ctrl",
    })
    .when("/forgot-password", {
      templateUrl: "pages/forgot-password.html",
      controller: "user-ctrl",
    })
    .when("/register", {
      templateUrl: "pages/register.html",
      controller: "user-ctrl",
    })
    .when("/login", {
      templateUrl: "pages/login.html",
      controller: "user-ctrl",
    })

    .when("/contact-us", { templateUrl: "pages/contact-us.html" })
    .when("/404", { templateUrl: "pages/404.html" })
    .otherwise({ redirectTo: "/" });
});

app.directive("convertDate", function () {
  return {
    require: "ngModel",
    link: function (scope, element, attrs, ngModel) {
      ngModel.$formatters.push(function (fromModel) {
        fromModel = new Date(fromModel);
        return fromModel;
      });
      ngModel.$parsers.push(function (fromField) {
        fromField = fromField.getTime();
        return fromField;
      });
    },
  };
});

app.factory("myService", function () {
  var savedData = {};
  function set(data) {
    savedData = data;
  }
  function get() {
    return savedData;
  }
  return {
    set: set,
    get: get,
  };
});

app.controller("myCtrl", ($scope, $rootScope) => {
  $rootScope.cart = {
    map: new Map(),
    array: [],
    total: 0,
  };
  getCartFromLocal($rootScope.cart);

  $scope.$on("addCart", (evt, data) => {
    let cart = $rootScope.cart;
    addToCart(cart, data);
  });

  $scope.removeCartItem = (item) => {
    console.log("remove item", item);
    removeItem($rootScope.cart, item);
  };

  $scope.$on("removeCartItem", (evt, data) => {
    console.log("remove cart item in app controller");
    $scope.removeCartItem(data);
  });
});

function addToCart(cart, product) {
  if (cart.map.has(product.id)) {
    let item = cart.map.get(product.id);
    item.quantity++;
  } else {
    cart.map.set(product.id, product);
  }
  loadCartData(cart);
}

function getTotal(cart) {
  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
  });
  return total;
}

function saveToLocal(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartData(cart) {
  cart.total = getTotal(cart.map);
  cart.array = [...cart.map.values()];
  saveToLocal(cart.array);
}

function getCartFromLocal(cart) {
  let items = JSON.parse(localStorage.getItem("cart"));
  if (items) {
    items.forEach((item) => cart.map.set(item.id, item));
    loadCartData(cart);
  }
}

function removeItem(cart, item) {
  if (cart.map.has(item.id)) {
    console.log(cart.map.delete(item.id));
    loadCartData(cart);
  }
}
