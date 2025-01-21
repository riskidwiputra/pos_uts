
const productRepository = require('../repositories/ProductRepository');
const { AppError } = require('../utils/errorHandler');

class ProductService {
  async createProduct(productData) {
    try {
      
      const existingProduct = await productRepository.findByName(productData.name);
      if (existingProduct) {
        throw new AppError('Product with this name already exists', 400);
      }

      const product = await productRepository.create(productData);
      return product;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      return await productRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts() {
    try {
      return await productRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, productData) {
    try {

      if (productData.name) {
        const existingProduct = await productRepository.findByName(productData.name);
        if (existingProduct && existingProduct.id !== parseInt(id)) {
          throw new AppError('Product with this name already exists', 400);
        }
      }

      const updatedProduct = await productRepository.update(id, productData);
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      return await productRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  async searchProducts(searchQuery) {
    try {
      if (!searchQuery) {
        throw new AppError('Search query is required', 400);
      }
      return await productRepository.findProductsBySimilarName(searchQuery);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProductService();