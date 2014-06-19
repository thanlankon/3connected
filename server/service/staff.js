define.service('service.Staff', function (service, require, ServiceUtil, Util) {

  var StaffModel = require('model.Staff');
  var ClassModel = require('model.Class');
  var DepartmentModel = require('model.Department');

  service.map = {
    url: '/staff'
  };

  service.methodConfig = {
    idAttribute: 'staffId',

    message: {
      entityName: 'staff',
      displayAttribute: 'staffName'
    },

      findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: DepartmentModel,
          as: 'department'
        }];
      }
    },

    create: {
      attributes: [
        'staffId',
        'firstName',
        'lastName',
        'gender',
        'dateOfBirth',
        'address',
        'email',
        'departmentId'
      ],
      checkDuplicatedAttributes: ['firstName']
    },

    update: {
      attributes: [
        'staffId',
        'firstName',
        'lastName',
        'gender',
        'dateOfBirth',
        'address',
        'email',
        'departmentId'
      ],
      checkExistanceAttributes: ['staffId'],
      checkDuplicatedAttributes: ['firstName']
    }
  }

});
