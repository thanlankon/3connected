define.service('service.Staff', function (service, require, ServiceUtil, Util) {

  var StaffModel = require('model.Staff');
  var DepartmentModel = require('model.Department');

  service.map = {
    url: '/staff'
  };

  service.Model = StaffModel;

  service.methodConfig = {
    idAttribute: 'staffId',

    message: {
      entityName: 'staff',
      displayAttribute: 'firstName'
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
        'staffCode',
        'firstName',
        'lastName',
        'gender',
        'dateOfBirth',
        'address',
        'email',
        'departmentId'
      ]
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
      checkExistanceAttributes: ['staffId']
    }
  }

});
