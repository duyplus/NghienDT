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

app.factory("$data", ($http) => {
  const api = "http://localhost:8080/api";
  const categoriesUrl = `${api}/category`;
  const productsUrl = `${api}/product`;
  //   const local = "assets/data";
  //   const categoriesUrl = `${local}/categories.json`;
  //   const productsUrl = `${local}/products.json`;
  const apiUrls = {
    categories: categoriesUrl,
    products: productsUrl,
  };
  return {
    fetch(name, $scope, url) {
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

app.factory("$cart", () => {
  return new Cart();
});

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
    console.log("remove item ", productId);
    this.#items.delete(productId);
    // this.saveToLocal();
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
