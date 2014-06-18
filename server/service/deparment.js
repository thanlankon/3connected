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
