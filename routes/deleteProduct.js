const express = require('express');
const DeleteProductService = require('../services/deleteProductService');

const router = express.Router();
const deleteProductService = new DeleteProductService();

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteProductService.deleteProduct(id);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Producto eliminado exitosamente',
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el producto',
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