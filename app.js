require('dotenv').config();
const express = require('express');
const cors = require('cors');

const createProductRouter = require('./routes/createProduct');
const readProductsRouter = require('./routes/readProducts');
const updateProductRouter = require('./routes/updateProduct');
const deleteProductRouter = require('./routes/deleteProduct');
const redisService = require('./services/redisService');
const { connectDB, syncDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({
    message: 'API REST con GraphQL y Redis Cache',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      health: '/health'
    }
  });
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/products', createProductRouter);
app.use('/api/products', readProductsRouter);
app.use('/api/products', updateProductRouter);
app.use('/api/products', deleteProductRouter);

const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    await syncDB();
    
    // Conectar a Redis (opcional)
    try {
      await redisService.connect();
      console.log('Redis conectado exitosamente');
    } catch (redisError) {
      console.log('Continuando sin Redis...');
    }
    
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error iniciando el servidor:', error);
    process.exit(1);
  }
};

startServer();

process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  await redisService.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recibido, cerrando servidor...');
  await redisService.disconnect();
  process.exit(0);
});

module.exports = app;