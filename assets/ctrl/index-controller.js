app.controller("index-ctrl", ($scope, $rootScope) => {
    $scope.owlOptions = {
        loop: true,
        dots: false,
        margin: 30,
        nav: true,
        navText: ['<i class="lnr lnr-arrow-left"></i>', '<i class="lnr lnr-arrow-right"></i>'],
        autoplay: false,
        stagePadding: 0,
        smartSpeed: 700,
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            480: {
                items: 2,
                nav: false
            },
            768: {
                items: 3
            },
            992: {
                items: 4
            },
            1024: {
                items: 4
            },
            1600: {
                items: 7
            }
        }
    };

    $scope.owlOptionss = {
        items: 3,
        loop: true,
        dots: false,
        margin: 30,
        nav: true,
        navText: ['<i class="lnr lnr-arrow-left"></i>', '<i class="lnr lnr-arrow-right"></i>'],
        autoplay: false,
        stagePadding: 0,
        smartSpeed: 700,
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            480: {
                items: 1,
                nav: false
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            },
            1024: {
                items: 3
            },
            1600: {
                items: 4
            }
        }
    };

    $scope.slickConfig = {
        arrows: false,
        autoplay: false,
        autoplaySpeed: 5000,
        dots: true,
        pauseOnFocus: false,
        pauseOnHover: false,
        fade: true,
        infinite: true,
        slidesToShow: 1,
        responsive: [{
            breakpoint: 767,
            settings: {
                dots: true,
            }
        }]
    };

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
        // console.log("remove item", item);
        removeItem($rootScope.cart, item);
    };

    $scope.$on("removeCartItem", (evt, data) => {
        // console.log("remove cart item in index controller");
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