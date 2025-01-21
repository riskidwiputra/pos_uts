const { Op } = require('sequelize');
const Products = require("../models").Products;
const { AppError } = require('../utils/errorHandler');

class ProductRepository {
  async findByName(name) {
    return await Products.findOne({ where: { name: name } });
  }

  async findById(id) { 
    const product = await Products.findByPk(id); 

    if (!product) {
      throw new AppError(`Product with ID ${id} not found`, 404); 
    }
    return product;
  }

  async create(productData) {
    return await Products.create(productData);
  }

  async update(id, productData) {
    const product = await this.findById(id);
    await product.update(productData);
    return product;
  }

  async delete(id) {
    const product = await this.findById(id);
    await product.destroy();
    return product;
  }

  async findProductsBySimilarName(searchQuery) {
    const products = await Products.findAll({
      where: {
        name: {
          [Op.like]: `%${searchQuery}%`
        }
      }
    });
    return products;
  }

  async findAll() {
    return await Products.findAll();
  }
}

module.exports = new ProductRepository();