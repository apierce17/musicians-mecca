const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

module.exports =  new Sequelize('jq858yyyih34r7ni', 'd8bq5beeo54cpifq', 'bl5fb0nnk1k1ji0r', {
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