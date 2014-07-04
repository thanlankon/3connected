define('core.auth.Authentication', function (module, require) {

  var Authentication = {};

  Authentication.encryptPassword = function (password) {
    var Crypto = require('lib.Crypto');

    var md5Hash = Crypto.createHash('md5');

    return md5Hash.update(password).digest('hex');
  };

  Authentication.generateAccessToken = function () {
    var UidSafe = require('lib.UidSafe');

    return UidSafe.sync(32);
  };

  Authentication.login = function (username, role, password, remember, callback) {
    var AuthenticationModel = require('model.Authentication');
    var AuthenticationConfig = require('config.Authentication');

    AuthenticationModel.verifyAccount(username, role, password, function (error, account) {
      if (error) {
        callback(error);
        return;
      }

      if (account === null) {
        callback(null, false);

        return;
      }

      var accessToken = Authentication.generateAccessToken();

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