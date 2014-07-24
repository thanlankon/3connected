/*
 * System          : 3connected
 * Component       : Major service
 * Creator         : UayLU
 * Created date    : 2014/06/14
 */
define.service('service.Major', function (service, require, ServiceUtil, Util) {

  var MajorModel = require('model.Major');

  service.map = {
    url: '/major',
    authorize: function (req, authentication, Role, commit) {
      // check for staff
      var authorized = Role.isEducator(authentication.accountRole);
      if (authorized) {
        commit(authorized);
        return;
      }

      commit(false);
    }
  };

  service.Model = MajorModel;

  service.methodConfig = {
    idAttribute: 'majorId',

    message: {
      entityName: 'major',
      displayAttribute: 'majorName'
    },

    create: {
      attributes: ['majorName'],
      checkDuplicatedAttributes: ['majorName']
    },

    update: {
      attributes: ['majorName'],
      checkExistanceAttributes: ['majorId'],
      checkDuplicatedAttributes: ['majorName']
    }
  }

});
