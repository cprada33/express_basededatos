const Product = require('../models/Product');
const redisService = require('./redisService');

class CreateProductService {
  async createProduct(productData) {
    try {
      const newProduct = await Product.create({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category
      });

      // Invalidar cache después de crear
      await redisService.invalidateProductCache();

      return {
        success: true,
        data: newProduct.toJSON()
      };
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return {
          success: false,
          error: 'Error de validación',
          details: error.errors.map(err => err.message)
        };
      }

      return {
        success: false,
        error: 'Error interno del servidor',
        details: [error.message]
      };
    }
  }
}

module.exports = CreateProductService;