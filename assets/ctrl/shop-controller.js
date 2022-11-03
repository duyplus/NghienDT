app.controller('shop-ctrl', function ($scope, $rootScope, $location, $http, $filter, productService) {
    var url = "http://localhost:8080/api/product";
    var urlcate = "http://localhost:8080/api/category";
    var urlcompany = "http://localhost:8080/api/company";

    $scope.items = [];
    $scope.cate = [];
    $scope.company = [];
    $scope.productdata = productService.get();
    setTimeout(function () {
        jQuery('#messageModal').modal('show');
    }, 0);

    var sweetalert_success = function (text) {
        Swal.fire({
            icon: "success",
            title: text,
            showConfirmButton: false,
            timer: 2000,
        });
    }
    var sweetalert_error = function (text) {
        Swal.fire({
            icon: "error",
            title: text,
            showConfirmButton: false,
            timer: 2000,
        });
    }


    //load category
    $http.get(urlcate).then(resp => {
        $scope.cate = resp.data;
    });

    //load company
    $http.get(urlcompany).then(resp => {
        $scope.company = resp.data;
    });

    //load data
    $http.get(url).then(resp => {
        $scope.items = resp.data;
        // paginate
        $scope.curPage = 1;
        $scope.itemsPerPage = 12;
        $scope.maxSize = 5;
        this.items = $scope.items;
        $scope.numOfPages = function () {
            return Math.ceil($scope.items.length / $scope.itemsPerPage);
        };
        $scope.$watch('curPage + numPerPage', function () {
            var begin = (($scope.curPage - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;
            $scope.filteredItems = $scope.items.slice(begin, end);
        });
    });

    //hien thi len form
    $scope.edit = function (item) {
        console.log(item)
        productService.set(item);
    }

    $scope.cart = {
        items: [],
        add(id) { // thêm sản phẩm vào giỏ hàng
            var item = this.items.find(item => item.id == id);
            if (item) {
                item.qty++;
                this.saveToLocalStorage();
            } else {
                $http.get(`${url}/${id}`).then(resp => {
                    resp.data.qty = 1;
                    this.items.push(resp.data);
                    this.saveToLocalStorage();
                })
            }
        },
        remove(id) { // xóa sản phẩm khỏi giỏ hàng
            var index = this.items.findIndex(item => item.id == id);
            this.items.splice(index, 1);
            this.saveToLocalStorage();
        },
        clear() { // Xóa sạch các mặt hàng trong giỏ
            this.items = []
            this.saveToLocalStorage();
        },
        amt_of(item) { // tính thành tiền của 1 sản phẩm
            return item.price * item.qty;
        },
        get count() { // tính tổng số lượng các mặt hàng trong giỏ
            return this.items
                .map(item => item.qty)
                .reduce((total, qty) => total += qty, 0);
        },
        get amount() { // tổng thành tiền các mặt hàng trong giỏ
            return this.items
                .map(item => this.amt_of(item))
                .reduce((total, amt) => total += amt, 0);
        },
        saveToLocalStorage() { // lưu giỏ hàng vào local storage
            var json = JSON.stringify(angular.copy(this.items));
            localStorage.setItem("cart", json);
        },
        loadFromLocalStorage() { // đọc giỏ hàng từ local storage
            var json = localStorage.getItem("cart");
            this.items = json ? JSON.parse(json) : [];
        }
    }

    $scope.cart.loadFromLocalStorage();
});