const Product = require('../models/Product');
const redisService = require('./redisService');

class ReadProductService {
  async getAllProducts(limit = 10, offset = 0) {
    const cacheKey = `products:${limit}:${offset}`;
    
    let cachedProducts = await redisService.get(cacheKey);
    if (cachedProducts) {
      return { success: true, data: cachedProducts, source: 'cache' };
    }

    try {
      const products = await Product.findAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      const productData = products.map(p => p.toJSON());
      
      await redisService.set(cacheKey, productData);
      
      return { 
        success: true, 
        data: productData, 
        source: 'database' 
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al obtener productos',
        details: [error.message]
      };
    }
  }

  async getProductById(id) {
    const cacheKey = `product:${id}`;
    
    let cachedProduct = await redisService.get(cacheKey);
    if (cachedProduct) {
      return { success: true, data: cachedProduct, source: 'cache' };
    }

    try {
      const product = await Product.findByPk(id);
      
      if (!product) {
        return {
          success: false,
          error: 'Producto no encontrado'
        };
      }

      const productData = product.toJSON();
      
      await redisService.set(cacheKey, productData);
      
      return { 
        success: true, 
        data: productData, 
        source: 'database' 
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al obtener el producto',
        details: [error.message]
      };
    }
  }
}

module.exports = ReadProductService;