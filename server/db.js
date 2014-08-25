define('db.Deploy', function (module, require) {

  var Entity = require('core.model.Entity');
  var Util = require('core.util.Util');
  var Configuration = require('core.config.Configuration').getConfiguration();
  var Logger = require('core.log.Logger');

  module.exports = deployDb;

  function deployDb(callback) {
    var syncDb = Configuration.SyncDb;

    if (!syncDb) {
      require('core.model.entity.EntityContainer').resoleAssociations();

      callback();

      return;
    }

    Logger.info('Deploying Db ...');

    deploySchema(function () {
      deployData(callback);
    });
  }

  function deployData(callback) {
    var queryChainer = Entity.queryChainer();

    seedAdministratorAccount(queryChainer);

    if (Configuration.ENABLE_DEVELOPMENT) {
      var dbSeeder = require('db.seed.DbSeeder');
      dbSeeder.seed(queryChainer);
    }

    queryChainer
      .runSerially()
      .success(function () {
        Logger.info('Db is deployed successfully');

        callback();
      })
      .error(function (error) {
        Logger.error('Error during seeding Db:', error);

        process.exit(1);
      });;
  }

  function seedAdministratorAccount(queryChainer) {
    // create initial administrator account

    var Account = require('model.entity.Account');
    var AuthenticationUtil = require('core.auth.AuthenticationUtil');
    var Role = require('enum.Role');
    var AccountConstant = require('constant.Account');
    var AccountConfig = require('config.Account');

    queryChainer
      .add(
        Account, 'create', [{
          userInformationId: 0,
          role: Role.ADMINISTRATOR,
          username: AccountConstant.ADMINISTRATOR_USERNAME,
          password: AuthenticationUtil.encryptPassword(AccountConfig.DEFAULT_PASSWORD),
          isActive: true,
          expiredDate: null
      }]);
  }

  function deploySchema(callback) {
    Entity
      .query('SET FOREIGN_KEY_CHECKS = 0')
      .then(function () {
        return Entity.sync({
          force: true
        });
      })
      .then(function () {
        return Entity.query('SET FOREIGN_KEY_CHECKS = 1');
      })
      .then(function () {
        // resolve entity associations
        require('core.model.entity.EntityContainer').resoleAssociations();

        callback();
      })
      .catch(function (error) {
        Logger.error('Error during deploying Db:', error);

        process.exit(1);
      });
  }

});
