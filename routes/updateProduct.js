const express = require('express');
const UpdateProductService = require('../services/updateProductService');

const router = express.Router();
const updateProductService = new UpdateProductService();

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    const result = await updateProductService.updateProduct(id, productData);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el producto',
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