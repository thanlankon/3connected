define.service('service.Account', function (service, require, ServiceUtil, Util) {

  var AccountModel = require('model.Account');

  service.map = {
    url: '/account',

    methods: {
      resetPassword: {
        url: '/resetPassword',
        httpMethod: 'POST',

        authorize: function (req, authentication, Role, commit) {
          // check for admin
          var authorized = Role.isAdministrator(authentication.accountRole);
          if (authorized) {
            commit(authorized);
            return;
          }

          commit(false);
        }
      }
    }
  };

  service.Model = AccountModel;

  service.methodConfig = {
    idAttribute: 'accountId',

    message: {
      entityName: 'account',
      displayAttribute: 'account'
    },

    findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.attributes = ['accountId', 'username', 'role', 'userInformationId', 'isActive', 'expiredDate'];
      }
    },

    create: {
      attributes: ['username', 'password', 'role', 'userInformationId', 'isActive', 'effectiveDate', 'expiredDate'],
      checkDuplicatedAttributes: ['username']
    },

    update: {
      attributes: ['username', 'password', 'role', 'userInformationId', 'isActive', 'effectiveDate', 'expiredDate'],
      checkExistanceAttributes: ['accountId'],
      checkDuplicatedAttributes: ['username', 'role']
    }
  };

  service.resetPassword = function (req, res) {

    var accountId = req.body.accountId;
    var password = req.body.password;

    var serviceResponse = {
      error: null,
      message: null
    };

    AccountModel.resetPassword(accountId, password, function (error, isNotFound) {
      if (error) {
        serviceResponse.message = 'account.resetPassword.error.unknown';
        serviceResponse.error = error;
      } else {
        if (isNotFound) {
          serviceResponse.error = {
            code: 'ENTITY.NOT_FOUND'
          };
          serviceResponse.message = 'account.resetPassword.error.notFound';
        } else {
          serviceResponse.message = 'account.resetPassword.success';
        }
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message);
    });

  };

});
