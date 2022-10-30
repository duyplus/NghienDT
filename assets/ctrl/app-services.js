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
//call: $data.fetch($scope, {name: api_name})
app.factory("$data", ($http) => {
  const api = "http://localhost:8080/api";
  const categoriesUrl = `${api}/category`;
  const productsUrl = `${api}/product`;
  // const local = "assets/data";
  // const categoriesUrl = `${local}/categories.json`;
  // const productsUrl = `${local}/products.json`;
  const apiUrls = {
    categories: categoriesUrl,
    products: productsUrl,
  };
  return {
    fetch($scope, { name, url }) {
      if (!url) url = apiUrls[name];
      $http
        .get(url)
        .then((resp) => {
          $scope[name] = resp.data;
        })
        .catch((err) => console.log(err));
    },
  };
});

app.factory("$templateUrl", () => {
  return {
    getHomeTemplates() {
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
    },
    getProductTemplates() {
      const templatePath = "pages/product";
      return {
        breadcrumb: `${templatePath}/breadcrumb.html`,
        details: `${templatePath}/details.html`,
        reviews: `${templatePath}/reviews.html`,
        related: `${templatePath}/related.html`,
      };
    },
  };
});

app.factory("$cart", () => {
  class Cart {
    #items;
    #cart_local = "cart";
    constructor() {
      this.#items = new Map();
      this.getFromLocal();
    }

    get size() {
      return this.#items.size;
    }

    get total() {
      let total = 0;
      this.#items.forEach((item) => {
        total += item.price * item.quantity;
      });
      return total;
    }

    get values() {
      return [...this.#items.values()];
    }

    getItem(id) {
      return this.#items.get(id);
    }
    contains(productId) {
      return this.#items.has(productId);
    }

    addItem(product) {
      let item = this.getItem(product.id);
      if (item) {
        if (item.quantity < product.quantity) item.quantity++;
        else {
          alert("Đã đạt giới hạn số lượng tối đa");
          return;
        }
      } else {
        this.#items.set(product.id, { ...product, quantity: 1 });
      }
      this.saveToLocal();
    }

    removeItem(productId) {
      this.#items.delete(productId);
      this.saveToLocal();
    }

    saveToLocal() {
      localStorage.setItem(this.#cart_local, JSON.stringify(this.values));
    }

    getFromLocal() {
      let localCart = localStorage.getItem(this.#cart_local);
      if (localCart && localCart != "undefined") {
        const items = JSON.parse(localCart);
        items.forEach((item) => this.addItem(item));
      } else localStorage.removeItem(this.#cart_local);
    }
  }
  return new Cart();
});

app.factory("$owlSlick", () => {
  return {
    configIndex($scope) {
      $scope.owlOptions = {
        loop: true,
        dots: false,
        margin: 30,
        nav: true,
        navText: [
          '<i class="lnr lnr-arrow-left"></i>',
          '<i class="lnr lnr-arrow-right"></i>',
        ],
        autoplay: false,
        stagePadding: 0,
        smartSpeed: 700,
        responsive: {
          0: {
            items: 1,
            nav: false,
          },
          480: {
            items: 2,
            nav: false,
          },
          768: {
            items: 3,
          },
          992: {
            items: 4,
          },
          1024: {
            items: 4,
          },
          1600: {
            items: 7,
          },
        },
      };

      $scope.owlOptionss = {
        items: 3,
        loop: true,
        dots: false,
        margin: 30,
        nav: true,
        navText: [
          '<i class="lnr lnr-arrow-left"></i>',
          '<i class="lnr lnr-arrow-right"></i>',
        ],
        autoplay: false,
        stagePadding: 0,
        smartSpeed: 700,
        responsive: {
          0: {
            items: 1,
            nav: false,
          },
          480: {
            items: 1,
            nav: false,
          },
          768: {
            items: 2,
          },
          992: {
            items: 3,
          },
          1024: {
            items: 3,
          },
          1600: {
            items: 4,
          },
        },
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
        responsive: [
          {
            breakpoint: 767,
            settings: {
              dots: true,
            },
          },
        ],
      };
    },
    configProduct($scope) {
      // product view mode change js
      $(".product-view-mode a").on("click", function (e) {
        e.preventDefault();

        var shopProductWrap = $(".shop-product-wrap");
        var viewMode = $(this).data("target");

        $(".product-view-mode a").removeClass("active");
        $(this).addClass("active");
        shopProductWrap.removeClass("grid list column_3").addClass(viewMode);
      });
      // product details slider active
      $(".product-large-slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        arrows: false,
        asNavFor: ".pro-nav",
      });

      // slick carousel active
      $(".pro-nav").slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        prevArrow:
          '<button type="button" class="arrow-prev"><i class="fa fa-long-arrow-left"></i></button>',
        nextArrow:
          '<button type="button" class="arrow-next"><i class="fa fa-long-arrow-right"></i></button>',
        asNavFor: ".product-large-slider",
        centerMode: true,
        arrows: true,
        centerPadding: 0,
        focusOnSelect: true,
      });

      // product details vertical slider active
      $(".product-large-slider1").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        arrows: false,
        asNavFor: ".pro-nav1",
      });

      // slick carousel active
      $(".pro-nav1").slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        prevArrow:
          '<button type="button" class="arrow-prev"><i class="fa fa-long-arrow-up"></i></button>',
        nextArrow:
          '<button type="button" class="arrow-next"><i class="fa fa-long-arrow-down"></i></button>',
        asNavFor: ".product-large-slider1",
        centerMode: true,
        arrows: true,
        vertical: true,
        centerPadding: 0,
        focusOnSelect: true,
      });

      // modal fix
      $(".modal").on("shown.bs.modal", function (e) {
        $(".pro-nav").resize();
      });

      // Flash sale active
      var flash_sale = $(".flash-sale-active");
      flash_sale.owlCarousel({
        loop: true,
        margin: 30,
        dots: false,
        autoplay: false,
        nav: true,
        navText: [
          '<i class="lnr lnr-arrow-left"></i>',
          '<i class="lnr lnr-arrow-right"></i>',
        ],
        stagePadding: 0,
        smartSpeed: 700,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          992: {
            items: 1,
          },
          1100: {
            items: 1,
          },
        },
      });

      // owl carousel active
      var flash_sale = $(".flash-sale-active4");
      flash_sale.owlCarousel({
        loop: true,
        margin: 30,
        dots: false,
        autoplay: false,
        nav: true,
        navText: [
          '<i class="lnr lnr-arrow-left"></i>',
          '<i class="lnr lnr-arrow-right"></i>',
        ],
        stagePadding: 0,
        smartSpeed: 700,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          992: {
            items: 4,
          },
          1024: {
            items: 5,
          },
          1600: {
            items: 6,
          },
        },
      });

      // latest product slider
      var latest_pro = $(".latest-slide-active");
      latest_pro.owlCarousel({
        margin: 30,
        loop: true,
        dots: false,
        autoplay: false,
        stagePadding: 0,
        smartSpeed: 700,
        responsive: {
          0: {
            items: 1,
          },

          480: {
            items: 1,
          },

          576: {
            items: 2,
          },

          768: {
            items: 2,
          },

          992: {
            items: 1,
          },

          1100: {
            items: 1,
          },
        },
      });
    },
  };
});
