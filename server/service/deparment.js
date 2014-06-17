//ThanhVMSE90059
define.service('service.Department', function (service, require, ServiceUtil, Util) {

  var DepartmentModel = require('model.Department');

  service.map = {
    url: '/department'
  };

  service.Model = DepartmentModel;

  service.methodConfig = {
    idAttribute: 'departmentId',

    findAll: {
      //      disabled: true
    },

    findOne: {
      message: {
        notFound: 'department.find.notFound'
      }
    },

    create: {
      attributes: ['departmentName'],
      checkDuplicatedAttributes: ['departmentName'],
      message: {
        duplicated: 'department.create.duplicated',
        success: 'department.create.success',
      }
    },

    update: {
      attributes: ['departmentName'],
      checkExistanceAttributes: ['departmentId'],
      checkDuplicatedAttributes: ['departmentName'],
      message: {
        duplicated: 'department.update.duplicated',
        notFound: 'department.update.notFound',
        success: 'department.update.success',
      }
    },

    destroy: {
      message: {
        incomplete: 'department.destroy.incomplete',
        success: 'department.destroy.success',
      }
    }
  }

});
