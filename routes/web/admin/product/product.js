const express       = require('express')
const router        = express.Router();
const checkToken   = require("../../../../middleware/checkToken")

const {getProductPage,getOrderPage,getSaleDetails}        = require('../../../../app/controllers/ProductController')



router.get('/list-product', checkToken, getProductPage);
router.get('/list-order', checkToken, getOrderPage);


module.exports = router;
