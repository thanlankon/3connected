define.model('model.Authentication', function (model, ModelUtil, require) {

  var Entity = require('core.model.Entity');
  var Account = require('model.entity.Account');
  var AccessToken = require('model.entity.AccessToken');
  var NotifyRegistration = require('model.entity.NotifyRegistration');
  var AuthenticationUtil = require('core.auth.AuthenticationUtil');

  model.verifyAccount = function (username, role, password, callback) {
    // encrypt password
    password = AuthenticationUtil.encryptPassword(password);

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

  model.createAccessToken = function (accessToken, account, timeToLive, registrationId, callback) {
    var NotifyFor = require('enum.NotifyFor');
    var Role = require('enum.Role');

    var accessTokenData = {
      accessToken: accessToken,
      accountId: account.accountId,
      timeToLive: timeToLive
    };

    var queryChainer = Entity.queryChainer();

    queryChainer.add(AccessToken, 'create', [accessTokenData]);

    if (registrationId && Role.isStudentOrParent(account.role)) {
      var notifyRegistration = {
        receiverId: account.userInformationId,
        registerFor: Role.isStudent(account.role) ? NotifyFor.STUDENT : NotifyFor.PARENT,
        registrationKey: registrationId
      };

      // delete the existed registrationKey
      queryChainer.add(NotifyRegistration, 'destroy', [{
        registrationKey: registrationId
      }]);

      queryChainer.add(NotifyRegistration, 'create', [notifyRegistration]);
    }

    queryChainer
      .runSerially({
        skipOnError: true
      })
      .success(function (results) {
        var createdAccessToken = results[0];

        callback(null, createdAccessToken);
      })
      .error(function (error) {
        callback(error);
      });
  };

  model.destroyAccessToken = function (accessToken, account, registrationId, callback) {
    var NotifyFor = require('enum.NotifyFor');
    var Role = require('enum.Role');

    var findAccessTokenConditions = {
      accessToken: accessToken
    };

    var queryChainer = Entity.queryChainer();

    queryChainer.add(AccessToken.destroy(findAccessTokenConditions));

    if (registrationId && Role.isStudentOrParent(account.role)) {
      var findRegistrationIdConditions = {
        receiverId: account.userInformationId,
        registerFor: Role.isStudent(account.role) ? NotifyFor.STUDENT : NotifyFor.PARENT,
        registrationKey: registrationId
      };

      queryChainer.add(NotifyRegistration.destroy(findRegistrationIdConditions));
    }

    queryChainer
      .run()
      .success(function (results) {
        callback(null, results && results[0] == 1);
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
