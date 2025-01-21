const SaleService = require('../services/SaleService');

class SaleController {
    async createSale(req, res) {
      try {
        const sale = await SaleService.createBulkSale(req.body);
  
        res.status(201).json({
          status: 'success',
          data: {
            sale_id: sale.id,
            receipt_no: sale.receipt_no
          }
        });
      } catch (error) {
        console.error('Error creating sale:', error);
        res.status(500).json({
          status: 'error',
          message: error.message || 'Failed to save sale data'
        });
      }
    }
    async getSaleDetails (req, res) {
      try {
          const saleId = parseInt(req.params.id);
          
          const sale = await SaleService.getSaleDetails(saleId);
          
          if (!sale) {
              return res.status(404).json({ message: 'Sale not found' });
          }

          res.json({ sale });
      } catch (error) {
          console.error('Error fetching sale details:', error);
          res.status(500).json({ 
              message: 'Error fetching sale details',
              error: error.message 
          });
      }
    }
    async sales_summary (req, res) {
        try {
          const period = req.query.period || 'month';

          const salesSummary = await SaleService.getSalesSummary(period);
          res.json(salesSummary);
        } catch (error) {
          res.status(500).json({ 
            message: 'Error fetching sales summary',
            error: error.message 
          });
        }

    }
    async sales_trend (req, res) {
      try {
        const salesTrend = await SaleService.getSalesTrend();
        res.json(salesTrend);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching sales trend data', error: error.message });
      }
    }
  }
  
  module.exports = new SaleController();