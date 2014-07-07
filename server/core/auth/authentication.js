define('core.auth.Authentication', function (module, require) {

  var AuthenticationModel = require('model.Authentication');
  var AuthenticationConfig = require('config.Authentication');
  var AuthenticationUtil = require('core.auth.AuthenticationUtil');

  var Authentication = {};

  Authentication.login = function (username, role, password, remember, callback) {
    AuthenticationModel.verifyAccount(username, role, password, function (error, account) {
      if (error) {
        callback(error);
        return;
      }

      if (account === null) {
        callback(null, false);

        return;
      }

      var accessToken = AuthenticationUtil.generateAccessToken();

      var timeToLive;
      if (remember) {
        timeToLive = AuthenticationConfig.TimeToLive.REMEMBER;
      } else {
        timeToLive = AuthenticationConfig.TimeToLive.SESSION;
      }

      AuthenticationModel.createAccessToken(accessToken, account.accountId, timeToLive, function (error, createdAccessToken) {
        if (error) {
          callback(error, true);
          return;
        }

        var data = {
          accessToken: accessToken,
          account: account
        };

        callback(null, true, data);
      });
    });
  };

  Authentication.logout = function (accessToken, callback) {
    AuthenticationModel.destroyAccessToken(accessToken, function (error, isDestroyed) {
      if (error) {
        callback(error);
        return;
      }

      callback(null, isDestroyed);
    });
  };

  Authentication.resetLastAccessTime = function (accessToken, callback) {
    AuthenticationModel.resetLastAccessTime(accessToken, function (error, isReseted) {
      if (error) {
        callback(error);
        return;
      }

      callback(null, isReseted);
    });
  };

  module.exports = Authentication;

});
