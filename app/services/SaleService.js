const saleRepository = require('../repositories/SaleRepository');
const { Sale, sequelize, Sequelize } = require('../models');
const { Op } = require('sequelize');
class SaleService {
  
    async createBulkSale(saleData) {

      try {
        
        const { receipt_no, receipt_date, cart, total_price, cash, change } = saleData;
        console.log(saleData);
  
        if (!receipt_no || !receipt_date || !cart || !total_price || !cash) {
          throw new Error('Missing required fields');
        }
        const user_id = 1;
  
        const sale = await saleRepository.createBulkSale(
          { receipt_no, receipt_date, total_price, cash, change, user_id },
          cart
        );
  
        return sale;
      } catch (error) {
        throw error;
      }
    }
  
    async getSaleByReceiptNo(receiptNo) {
      return await saleRepository.findSaleByReceiptNo(receiptNo);
    }
    async getAllOrder() {
        try {
          return await saleRepository.findAll();
        } catch (error) {
          throw error;
        }
      }
    async getSaleDetails(sale_id){
      try {
        return await saleRepository.findById(sale_id);
      } catch (error) {
        throw error;
      }
     
    };
    async getSalesSummary(period = 'month'){
      const now = new Date();
      let startDate;

      switch (period) {
        case 'week':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case 'month':
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      try {
        // Calculate total revenue for the specified period
        const totalRevenue = await Sale.sum('total_price', {
          where: {
            receipt_date: {
              [Op.gte]: startDate
            }
          }
        });

        // Calculate average order value
        const averageOrderValue = await Sale.findAll({
          attributes: [
            [sequelize.fn('AVG', sequelize.col('total_price')), 'avg_order_value']
          ],
          where: {
            receipt_date: {
              [Op.gte]: startDate
            }
          }
        });

        // Get monthly breakdown
        const monthlyRevenue = await Sale.findAll({
          attributes: [
            [sequelize.fn('MONTH', sequelize.col('receipt_date')), 'month'],
            [sequelize.fn('SUM', sequelize.col('total_price')), 'total_revenue']
          ],
          where: {
            receipt_date: {
              [Op.gte]: startDate
            }
          },
          group: [sequelize.fn('MONTH', sequelize.col('receipt_date'))],
          order: [[sequelize.fn('MONTH', sequelize.col('receipt_date')), 'ASC']],
          raw: true // This ensures we get plain objects instead of Sequelize instances
        });
        const totalSales = await Sale.count();
        const alltotalRevenue = await Sale.sum('total_price');

        return {
          totalSales,
          alltotalRevenue,
          totalRevenue: totalRevenue || 0,
          averageOrderValue: averageOrderValue[0]?.get('avg_order_value') || 0,
          monthlyBreakdown: monthlyRevenue.map(item => ({
            month: item.month,
            revenue: item.total_revenue
          }))
        };
      } catch (error) {
        console.error('Error calculating monthly sales summary:', error);
        throw error;
      }
      }

      async getSalesTrend() {
        try {
          const salesTrend = await Sale.findAll({
            attributes: [
              [sequelize.fn('YEAR', sequelize.col('receipt_date')), 'year'],
              [sequelize.fn('MONTH', sequelize.col('receipt_date')), 'month'],
              [sequelize.fn('COUNT', sequelize.col('id')), 'total_sales'],
              [sequelize.fn('SUM', sequelize.col('total_price')), 'total_revenue']
            ],
            group: [
              sequelize.fn('YEAR', sequelize.col('receipt_date')),
              sequelize.fn('MONTH', sequelize.col('receipt_date'))
            ],
            order: [
              [sequelize.fn('YEAR', sequelize.col('receipt_date')), 'ASC'],
              [sequelize.fn('MONTH', sequelize.col('receipt_date')), 'ASC']
            ],
            raw: true
          });
      
          return salesTrend;
        } catch (error) {
          console.error('Error fetching sales trend:', error);
          throw error;
        }
      }

  }
  
  module.exports = new SaleService();