
const Sale  = require("../models").Sale;
const User  = require("../models").Users;
const SaleItem  = require("../models").SaleItem;
// const { sequelize } = require('sequelize');
const d = require('../models/index');
const { AppError } = require('../utils/errorHandler');

class SaleRepository {

    async createBulkSale(saleData, items) {

        const t = await d.sequelize.transaction();

        try {
            if (!saleData.user_id) {
                throw new Error('User ID is required');
              }
            const sale = await Sale.create(saleData, { transaction: t });

            const saleItems = items.map(item => ({
                sale_id: sale.id,
                product_id: item.productId,
                product_name: item.name,
                price: item.price,
                quantity: item.qty,
                subtotal: item.price * item.qty
            }));

            await SaleItem.bulkCreate(saleItems, { transaction: t });

            await t.commit();
        return sale;
        } catch (error) {
        await t.rollback();
        throw error;
        }
    }
    async findSaleByReceiptNo(receiptNo) {
        return await Sale.findOne({
          where: { receipt_no: receiptNo },
          include: [{
            model: SaleItem,
            as: 'items'
          }]
        });
    }
    async findById(saleId) {
      try {
        const sale = await Sale.findByPk(saleId, {
          include: [{
            model: SaleItem,
            as: 'items'
          },
          {
            model: User,
            as: 'cashier',
            attributes: ['fullname']
        },]
        });
        return sale;
      } catch (error) {
        throw error;
      }
    }
  
    async findByUserId(userId) {
      try {
        const sales = await Sale.findAll({
          where: { user_id: userId },
          include: [{
            model: SaleItem,
            as: 'items'
          }]
        });
        return sales;
      } catch (error) {
        throw error;
      }
    }
  
    async findAll(options = {}) {
      try {
        const sales = await Sale.findAll({
          ...options,
          include: [{
            model: SaleItem,
            as: 'items'
          },
          {
            model: User, 
            as: 'cashier', 
            attributes: ['id', 'fullname', 'email'] 
          }
        ],  order: [['createdAt', 'DESC']],
        });
        return sales;
      } catch (error) {
        throw error;
      }
    }
}

module.exports = new SaleRepository();