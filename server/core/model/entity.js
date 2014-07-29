define('core.model.Entity', function (module, require) {

  var Sequelize = require('lib.Sequelize');
  var Configuration = require('core.config.Configuration').getConfiguration();

  var sequelize = new Sequelize(
    Configuration.Database.NAME,
    Configuration.Database.USERNAME,
    Configuration.Database.PASSWORD, {
      logging: false,

      host: Configuration.Database.HOST,
      port: Configuration.Database.PORT,

      define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
      dialectOptions: {
        charset: 'utf8',
      },
      maxConcurrentQueries: 100,
      pool: {
        maxConnections: 5,
        maxIdleTime: 3600000
      },
    });

  sequelize.queryChainer = function () {
    return new Sequelize.Utils.QueryChainer();
  }

  module.exports = sequelize;

});
