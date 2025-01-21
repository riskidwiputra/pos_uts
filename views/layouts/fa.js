
const Users                 = require("../models").Users;
const bcrypt                = require("bcrypt");
const jwt                   = require("jsonwebtoken");
const {validationResult}    = require('express-validator');

class AuthController {
    // static async register(req, res) {
    //   try {
    //     const errors = validationResult(req);
  
    //     if (!errors.isEmpty()) {
    //       console.log(errors);
    //       req.flash('msg', "Registration Failed, please check again");
    //       return res.redirect('/register');
    //     }
  
    //     const { fullname, email, password } = req.body;
    //     const salt = await bcrypt.genSalt(10);
    //     const hashPassword = await bcrypt.hash(password, salt);
  
    //     await Users.create({
    //       fullname,
    //       email,
    //       password: hashPassword,
    //       role_id: 2, // Assuming user role is 2 for registration
    //     });
  
    //     req.flash('msg', "Registration Complete, Please login to continue");
    //     res.redirect('/login');
    //   } catch (error) {
    //     console.log(error);
    //     res.status(500).json({ message: "Internal Server Error" }); // Handle errors more gracefully
    //   }
    // }
  
    static async login(req, res) {
      try {
        if (!req.body.email) {
          req.flash('msg', 'Please enter your email address.');
          return res.redirect('/login');
        }
  
        const user = await Users.findOne({ where: { email: req.body.email } });
        if (!user) {
          req.flash('msg', "Email Anda Tidak Terdafar");
          return res.redirect("/login");
        }
  
        const check = await bcrypt.compare(req.body.password, user.password);
  
        if (!check) {
          req.flash('msg', "Password Anda Salah");
          return res.redirect("/login");
        }
  
        const user_id = user.id;
        const nama = user.fullname;
        const email = user.email;
  
        const accessToken = jwt.sign(
          { user_id, nama, email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '10m' }
        );
        const refreshToken = jwt.sign(
          { user_id, nama, email },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: '1d' }
        );
  
        await Users.update(
          { refresh_token: refreshToken },
          { where: { id: user_id } }
        );
  
        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
  
        console.log(accessToken);
        res.redirect('/admin/');
      } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Invalid credentials" }); // Handle errors more gracefully
      }
    }
  
    static async logout(req, res) {
      const refresh_token = req.cookies.refresh_token;
      if (!refresh_token) return res.redirect("/login");
  
      const user = await Users.findOne({ where: { refresh_token } });
      if (!user) return res.redirect("/login");
  
      const user_id = user.id;
      await Users.update({ refresh_token: null }, { where: { id: user_id } });
  
      res.clearCookie('refresh_token');
      res.redirect('/');
    }
  }
  
  module.exports = AuthController;



  async function loadDatabase() {
    // const db = await idb.openDB("tailwind_store", 1, {
    //   upgrade(db, oldVersion, newVersion, transaction) {
    //     db.createObjectStore("products", {
    //       keyPath: "id",
    //       autoIncrement: true,
    //     });
    //     db.createObjectStore("sales", {
    //       keyPath: "id",
    //       autoIncrement: true,
    //     });
    //   },
    // });
  
    // return {
    //   db,
    //   getProducts: async () => await db.getAll("products"),
    //   addProduct: async (product) => await db.add("products", product),
    //   editProduct: async (product) =>
    //     await db.put("products", product.id, product),
    //   deleteProduct: async (product) => await db.delete("products", product.id),
    // };
  }
  
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
        if (typeof idb !== 'undefined') {
          this.db = await loadDatabase(); // Call only if idb is available
        } else {
          console.error("idb library not found");
        }
       
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
        this.receiptNo = `TWPOS-KS-${Math.round(time.getTime() / 1000)}`;
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
      printAndProceed() {
        const receiptContent = document.getElementById('receipt-content');
        const titleBefore = document.title;
        const printArea = document.getElementById('print-area');
  
        printArea.innerHTML = receiptContent.innerHTML;
        document.title = this.receiptNo;
  
        window.print();
        this.isShowModalReceipt = false;
  
        printArea.innerHTML = '';
        document.title = titleBefore;
  
        // TODO save sale data to database
  
        this.clear();
      }
    };
  
    return app;
  }
  