define.model('model.Authentication', function (model, ModelUtil, require) {

  var Account = require('model.entity.Account');
  var AccessToken = require('model.entity.AccessToken');

  model.verifyAccount = function (username, role, password, callback) {
    var findConditions = {
      where: {
        username: username,
        role: role,
        password: password
      },
      attributes: ['accountId', 'username', 'role', 'userInformationId', 'isActive', 'expiredDate']
    };

    Account.find(findConditions)
      .success(function (account) {
        callback(null, account);
      })
      .error(function (error) {
        callback(error);
      });
  };

  model.createAccessToken = function (accessToken, accountId, timeToLive, callback) {
    var accessTokenData = {
      accessToken: accessToken,
      accountId: accountId,
      timeToLive: timeToLive
    };

    AccessToken.create(accessTokenData)
      .success(function (createdAccessToken) {
        callback(null, createdAccessToken);
      })
      .error(function (error) {
        callback(error);
      });
  };

  model.destroyAccessToken = function (accessToken, callback) {
    var findConditions = {
      where: {
        accessToken: accessToken
      }
    };

    AccessToken.destroy(findConditions)
      .success(function (affectedRows) {
        callback(null, affectedRows == 1);
      })
      .error(function (error) {
        callback(error);
      });
  };

  model.resetLastAccessTime = function (accessToken, callback) {
    var currentTime = new Date();

    AccessToken.update({
      accessToken: accessToken
    }, {
      lastAccessTime: currentTime
    })
      .success(function (affectedRows) {
        callback(null, affectedRows == 1);
      })
      .error(function (error) {
        callback(error);
      });
  };

  model.retrieveAccessTokenInfo = function (accessToken, callback) {

    var findConditions = {
      where: {
        accessToken: accessToken
      },
      include: [{
        model: Account,
        as: 'account'
      }]
    };

    AccessToken.find(findConditions)
      .success(function (accessToken) {
        callback(null, accessToken);
      })
      .error(function (error) {
        callback(error);
      });
  };

});
