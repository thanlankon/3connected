define('config.Configuration', function (module, require) {

  var Configuration = {
    Environments: {}
  };

  Configuration['Environment'] = 'LocalHost';
  Configuration['Development'] = true;

  Configuration['SyncDbKey'] = 'splink';

  // this server identification is using for
  // determite location of attachments and news content
  Configuration['ServerId'] = 'srv01';

  Configuration.Environments['LocalHost'] = {
    Web: {
      PORT: 4430,
      SSL: true
    },
    Database: {
      HOST: 'localhost',
      PORT: 3306,
      NAME: '3connected',
      USERNAME: 'root',
      PASSWORD: 'root'
    },
    File: {
      LOCATION: __dirname + '/../../data'
    }
  }

  Configuration.Environments['OpenShift'] = {
    Web: {
      HOST: process.env.OPENSHIFT_NODEJS_IP,
      PORT: process.env.OPENSHIFT_NODEJS_PORT,
    },
    Database: {
      HOST: process.env.OPENSHIFT_MYSQL_DB_HOST,
      PORT: process.env.OPENSHIFT_MYSQL_DB_PORT,
      NAME: process.env.OPENSHIFT_GEAR_NAME,
      USERNAME: process.env.OPENSHIFT_MYSQL_DB_USERNAME,
      PASSWORD: process.env.OPENSHIFT_MYSQL_DB_PASSWORD
    }
  }

  module.exports = Configuration;

});
