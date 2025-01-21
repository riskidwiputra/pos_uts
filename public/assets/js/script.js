

function initApp() {
  const app = {
    db: null,
    time: null,
    // firstTime: localStorage.getItem("first_time") === null,
    activeMenu: 'pos',
    loadingSampleData: false,
    moneys: [2000, 5000, 10000, 20000, 50000, 100000],
    products: [],
    keyword: "",
    cart: [],
    cash: 0,
    change: 0,
    isShowModalReceipt: false,
    receiptNo: null,
    receiptDate: null,
    async initDatabase() {
      this.loadProducts();
    },

    async loadProducts() {
      const response = await axios.get('/api/products');
      data = response.data.data;
      this.products = data.products;
      // for (let product of data.products) {
      //   await this.db.addProduct(product);
      // }

      this.setFirstTime(false);
      // this.products = await this.db.getProducts();
      console.log("products loaded", this.products);
    },
    async startWithSampleData() {
      const response = await fetch("assets/data/sample.json");
      
      const data = await response.json();
      this.products = data.products;
      for (let product of data.products) {
        await this.db.addProduct(product);
      }

      this.setFirstTime(false);
    },
    startBlank() {
      this.setFirstTime(false);
    },
    setFirstTime(firstTime) {
      this.firstTime = firstTime;
      if (firstTime) {
        localStorage.removeItem("first_time");
      } else {
        localStorage.setItem("first_time", new Date().getTime());
      }
    },
    filteredProducts() {
      const rg = this.keyword ? new RegExp(this.keyword, "gi") : null;
      return this.products.filter((p) => !rg || p.name.match(rg));
    },
    addToCart(product) {
      const index = this.findCartIndex(product);
      if (index === -1) {
        this.cart.push({
          productId: product.id,
          image: product.image,
          name: product.name,
          price: product.price,
          option: product.option,
          qty: 1,
        });
      } else {
        this.cart[index].qty += 1;
      }
      console.log(this.cart);
      console.log(this.product);
      
      this.updateChange();
    },
    findCartIndex(product) {
      return this.cart.findIndex((p) => p.productId === product.id);
    },
    addQty(item, qty) {
      const index = this.cart.findIndex((i) => i.productId === item.productId);
      if (index === -1) {
        return;
      }
      const afterAdd = item.qty + qty;
      if (afterAdd === 0) {
        this.cart.splice(index, 1);
        
      } else {
        this.cart[index].qty = afterAdd;
        
      }
      this.updateChange();
    },
    addCash(amount) {      
      this.cash = (this.cash || 0) + amount;
      this.updateChange();
      
    },
    getItemsCount() {
      return this.cart.reduce((count, item) => count + item.qty, 0);
    },
    updateChange() {
      this.change = this.cash - this.getTotalPrice();
    },
    updateCash(value) {
      this.cash = parseFloat(value.replace(/[^0-9]+/g, ""));
      this.updateChange();
    },
    getTotalPrice() {
      return this.cart.reduce(
        (total, item) => total + item.qty * item.price,
        0
      );
    },
    submitable() {
      return this.change >= 0 && this.cart.length > 0;
    },
    submit() {
      const time = new Date();
      this.isShowModalReceipt = true;
      this.receiptNo = `UASPOS-Mikro-${Math.round(time.getTime() / 1000)}`;
      this.receiptDate = this.dateFormat(time);
    },
    closeModalReceipt() {
      this.isShowModalReceipt = false;
    },
    dateFormat(date) {
      const formatter = new Intl.DateTimeFormat('id', { dateStyle: 'short', timeStyle: 'short'});
      return formatter.format(date);
    },
    numberFormat(number) {
      return (number || "")
        .toString()
        .replace(/^0|\./g, "")
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    },
    priceFormat(number) {
      return number ? `Rp. ${this.numberFormat(number)}` : `Rp. 0`;
    },
    clear() {
      this.cash = 0;
      this.cart = [];
      this.receiptNo = null;
      this.receiptDate = null;
      this.updateChange();
      
    },
    async printAndProceed() {
      try {
        const receiptContent = document.getElementById('receipt-content');
        const titleBefore = document.title;
        const printArea = document.getElementById('print-area');

        printArea.innerHTML = receiptContent.innerHTML;
        document.title = this.receiptNo;
        window.print();
        const saleData = {
          receipt_no: this.receiptNo,
          receipt_date: new Date(),
          cart: this.cart,
          total_price: this.getTotalPrice(),
          cash: this.cash,
          change: this.change
        };
        console.log(JSON.stringify(this.cart, null, 2));
        console.log(saleData);
        const response = await axios.post('/api/sales', saleData);

        if (response.data.status === 'success') {
          console.log("berhasil");
          alert("Data penjualan berhasil disimpan");
          notify({
            type: 'success',
            message: 'Data penjualan berhasil disimpan'
          });
    
          this.isShowModalReceipt = false;
          printArea.innerHTML = '';
          document.title = titleBefore;
          this.clear();
        }
     
        // this.isShowModalReceipt = false;

        // printArea.innerHTML = '';
        // document.title = titleBefore;

        // TODO save sale data to database

        // this.clear();
      } catch (error) {
        console.error('Error processing sale:', error);
        // Tampilkan error dengan detail
        notify({
          type: 'error',
          message: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data penjualan'
        });
      }
    }
  };

  return app;
}
