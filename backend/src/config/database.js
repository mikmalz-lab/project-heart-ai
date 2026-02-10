const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // File database lokal, tidak butuh password/setup
  logging: false
});

/*
// Opsi Postgres (Jika ingin pakai Postgres, uncomment ini & sesuaikan .env)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    port: process.env.DB_PORT || 5432,
  }
);
*/


module.exports = { sequelize };
