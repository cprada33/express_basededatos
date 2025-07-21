const express = require('express');
const CreateProductService = require('../services/createProductService');

const router = express.Router();
const createProductService = new CreateProductService();

router.post('/', async (req, res, next) => {
  try {
    const productData = req.body;
    const result = await createProductService.createProduct(productData);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error al crear el producto',
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