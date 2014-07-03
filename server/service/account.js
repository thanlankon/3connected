define.service('service.Account', function (service, require, ServiceUtil, Util) {

  var BatchModel = require('model.Account');

  service.map = {
    url: '/account'
  };

  service.Model = BatchModel;

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
      checkExistanceAttributes: ['username'],
      checkDuplicatedAttributes: ['accountId', 'username']
    }
  }

});
