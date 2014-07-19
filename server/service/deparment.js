/*
 * System          : 3connected
 * Component       : Department service
 * Creator         : ThanhVM
 * Modifier        : UayLU
 * Created date    : 2014/16/06
 */
define.service('service.Department', function (service, require, ServiceUtil, Util) {

  var DepartmentModel = require('model.Department');

  service.map = {
    url: '/department',
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

  service.Model = DepartmentModel;

  service.methodConfig = {
    idAttribute: 'departmentId',

    message: {
      entityName: 'department',
      displayAttribute: 'departmentName'
    },

    create: {
      attributes: ['departmentName'],
      checkDuplicatedAttributes: ['departmentName']
    },

    update: {
      attributes: ['departmentName'],
      checkExistanceAttributes: ['departmentId'],
      checkDuplicatedAttributes: ['departmentName']
    }
  }

});
