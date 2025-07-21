const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_PATH || './database.sqlite',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente');
    return true;
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    return false;
  }
};

const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Tablas sincronizadas correctamente');
    return true;
  } catch (error) {
    console.error('Error sincronizando tablas:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  connectDB,
  syncDB
};