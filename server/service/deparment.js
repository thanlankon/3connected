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
    url: '/department'
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
