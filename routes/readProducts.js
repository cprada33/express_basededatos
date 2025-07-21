const express = require('express');
const ReadProductService = require('../services/readProductService');

const router = express.Router();
const readProductService = new ReadProductService();

router.get('/', async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const result = await readProductService.getAllProducts(parseInt(limit), parseInt(offset));
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        source: result.source
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error al obtener productos',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await readProductService.getProductById(id);
    
    if (result.success) {
      if (result.data) {
        res.json({
          success: true,
          data: result.data,
          source: result.source
        });
      } else {
        res.status(404).json({
          success: false,
          message: `Producto con ID ${id} no encontrado`
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: 'Error al obtener el producto',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;