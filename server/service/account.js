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

    create: {
      attributes: ['username', 'password', 'role', 'userInformationId', 'isActive', 'effectiveDate', 'expireDate'],
      checkDuplicatedAttributes: ['username']
    },

    update: {
      attributes: ['username', 'password', 'role', 'userInformationId', 'isActive', 'effectiveDate', 'expireDate'],
      checkExistanceAttributes: ['username'],
      checkDuplicatedAttributes: ['accountId', 'username']
    }
  }

});
