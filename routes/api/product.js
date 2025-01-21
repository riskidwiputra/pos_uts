const express = require('express');
const router = express.Router();
const productController = require('../../app/controllers/ProductController');
const validateProduct  = require("../../app/validators/validateProduct")
const upload   = require("../../middleware/upload")
const verifyToken   = require("../../middleware/verifyToken")


router.post('/products',upload.single('image'), verifyToken, productController.createProduct);
router.get('/products', productController.getAllProducts);
router.get('/products/search', productController.searchProducts);
router.get('/product/:id', productController.getProduct);
router.put('/products/:id', upload.single('image'),verifyToken, productController.updateProduct);
router.delete('/products/:id',verifyToken, productController.deleteProduct);

module.exports = router;