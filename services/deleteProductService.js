const Product = require('../models/Product');
const redisService = require('./redisService');

class DeleteProductService {
  async deleteProduct(id) {
    if (!id) {
      return {
        success: false,
        error: 'ID del producto es requerido'
      };
    }

    try {
      const product = await Product.findByPk(id);
      
      if (!product) {
        return {
          success: false,
          error: 'Producto no encontrado'
        };
      }

      await product.destroy();

      // Invalidar cache después de eliminar
      await redisService.invalidateProductCache(id);

      return {
        success: true,
        data: { id, message: 'Producto eliminado correctamente' }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error interno del servidor',
        details: [error.message]
      };
    }
  }
}

module.exports = DeleteProductService;