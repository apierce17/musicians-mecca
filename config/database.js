const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

module.exports =  new Sequelize('musical_mecca', 'root', 'password', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
  },
  operatorsAliases: false
});