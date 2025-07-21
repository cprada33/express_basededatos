const Product = require('../models/Product');
const redisService = require('./redisService');

class UpdateProductService {
  async updateProduct(id, productData) {
    try {
      const existingProduct = await Product.findByPk(id);
      
      if (!existingProduct) {
        return {
          success: false,
          error: 'Producto no encontrado'
        };
      }

      await existingProduct.update({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category
      });

      // Invalidar cache después de actualizar
      await redisService.invalidateProductCache(id);

      return {
        success: true,
        data: existingProduct.toJSON()
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

module.exports = UpdateProductService;