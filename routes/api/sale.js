const express = require('express');
const router = express.Router();
const SaleController = require('../../app/controllers/SaleController');


router.post('/sales',  SaleController.createSale);
router.get('/sales/:id',  SaleController.getSaleDetails);
router.get('/sales-summary',  SaleController.sales_summary);
router.get('/sales-trend',  SaleController.sales_trend);

module.exports = router;