const productService = require('../services/ProductService');


class HomeController {
    static async home(req, res) {
      try {
        const products = await productService.getAllProducts();
        res.render('home', { 
          layout: false,
          products: products,
          baseUrl: process.env.BASE_URL || ''
        });
        // res.render('home', {
        //     layout: false
        // });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
  
  module.exports = HomeController;