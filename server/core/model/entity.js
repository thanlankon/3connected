define('core.model.Entity', function (module, require) {

  var Sequelize = require('lib.Sequelize');
  var DatabaseConfig = require('config.Database');

  var sequelize = new Sequelize(
    DatabaseConfig.NAME,
    DatabaseConfig.USERNAME,
    DatabaseConfig.PASSWORD, {
      define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
      dialectOptions: {
        charset: 'utf8',
      }
    });

  sequelize.queryChainer = function () {
    return new Sequelize.Utils.QueryChainer();
  }

  module.exports = sequelize;

});
