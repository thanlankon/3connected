define('core.config.Configuration', function (module, require) {

  var Config = require('config.Configuration');
  var Util = require('core.util.Util');

  var configuration;

  module.exports = {
    getConfiguration: getConfiguration
  };

  function getConfiguration() {
    if (configuration) return configuration;

    configuration = {};

    var env = Config.Environment;

    var envConfig = Config.Environments[env];

    var argv = process.argv;

    var argConfig = {};

    for (var i = 2, len = argv.length; i < len; i++) {
      var arg = argv[i];

      if (arg.slice(0, 'PORT='.length).toUpperCase() === 'PORT=') {
        argConfig.PORT = arg.slice('PORT='.length).trim().toUpperCase();

        continue;
      }

      if (arg.slice(0, 'SYNCDB='.length).toUpperCase() === 'SYNCDB=') {
        var dbOption = arg.slice('SYNCDB='.length).trim();

        if (dbOption === Config.SyncDbKey) {
          argConfig.SYNC_DB = true;
        }

        continue;
      }
    }

    envConfig.Web = envConfig.Web || {};

    if (process.env['APP_SYNCDB'] === Config.SyncDbKey) {
      argConfig.SYNC_DB = true
    }

    if (argConfig.PORT) {
      envConfig.Web.PORT = +argConfig.PORT;
    }

    if (argConfig.SYNC_DB) {
      envConfig.SyncDb = true;
    }

    // cache the config
    configuration = envConfig;

    // default
    configuration.Web.PORT = configuration.Web.PORT || 80;

    configuration.Database.HOST = configuration.Database.HOST || '127.0.0.1';
    configuration.Database.PORT = configuration.Database.PORT || 3306;

    var path = require('lib.Path');
    var rootDirectory = path.join(__dirname, '../../..');

    configuration.ENABLE_DEVELOPMENT = !!Config.Development;
    configuration.ROOT_DIRECTORY = rootDirectory;

    configuration.File.LOCATION = path.normalize(configuration.File.LOCATION);

    configuration.ServerId = Config.ServerId;

    return configuration;
  }

});
