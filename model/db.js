// use Sequelize
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PWD, {
  host: process.env.HOST,
  dialect: 'mysql',
  timezone: "+08:00"
});

sequelize
  .authenticate()
  .then(() => console.log('Connecting succeeded'))
  .catch(error => console.log(`Connecting error: ${error}`))

module.exports = sequelize;
