
const productService = require('../services/ProductService');
const AuthService = require('../services/AuthService');
const SaleService = require('../services/SaleService');
const Users         = require("../models").Users;
const Roles         = require("../models").Roles;
const { validationResult } = require('express-validator');
const { AppError } = require('../utils/errorHandler');



class ProductController {
  async getProductPage(req, res) {
      try {
          const refreshToken = req.cookies.refresh_token;
          const user = await Users.findOne({ where: { refresh_token: refreshToken },
              include: [
                  {
                      model: Roles,
                      attributes:['role_name']
                  },
              ]
          });
          const products = await productService.getAllProducts();
          
          res.render('admin/product/index', {
            layout: "admin/layouts/",
            title: "List Product",
            menu : "product",
            user,
            baseUrl: process.env.BASE_URL,
              products,
              formatCurrency: (amount) => {
                  return new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR'
                  }).format(amount);
              }
          });
      } catch (error) {
          console.error('Error:', error);
          res.status(500).render('error', { message: 'Internal server error' });
      }
  }
  async getOrderPage(req, res) {
    try {
        const refreshToken = req.cookies.refresh_token;
        const user = await Users.findOne({ where: { refresh_token: refreshToken },
            include: [
                {
                    model: Roles,
                    attributes:['role_name']
                },
            ]
        });
        const orders = await SaleService.getAllOrder();
        console.log(orders);
        
        res.render('admin/product/orderlist', {
          layout: "admin/layouts/",
          title: "List order",
          menu : "product",
          user,
          baseUrl: process.env.BASE_URL,
          orders,
          formatCurrency: (amount) => {
              return new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
              }).format(amount);
          },
          formatDate: (date) => {
            return new Date(date).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
        }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { message: 'Internal server error' });
    }
  }
  
  

  async createProduct(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new AppError('Validation Error', 400, errors.array());
      }
      console.log(errors.array());

      const productData = {
        ...req.body,
        image: req.file ? `assets/img/${req.file.filename}` : null
    };
    console.log(productData);

      const product = await productService.createProduct(productData);
      res.status(201).json({
        status: 'success',
        data: { product }
      });
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: { product }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllProducts(req, res, next) {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json({
        status: 'success',
        data: { products }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation Error', 400, errors.array());
      }
      const productData = {
          ...req.body
      };        
      if (req.file) {
        productData.image = `assets/img/${req.file.filename}`;
      }

      const product = await productService.updateProduct(req.params.id, req.body);

      res.status(200).json({
        status: 'success',
        data: { product }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(200).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }

  async searchProducts(req, res, next) {
    try {
      const { query } = req.query;
      const products = await productService.searchProducts(query);
      res.status(200).json({
        status: 'success',
        data: { products }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();