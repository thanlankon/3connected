define.service('service.Student', function (service, require, ServiceUtil, Util) {

  var StudentModel = require('model.Student');
  var ClassModel = require('model.Class');

  service.map = {
    url: '/student'
  };

  service.Model = StudentModel;

  service.methodConfig = {
    idAttribute: 'studentId',

    message: {
      entityName: 'student',
      displayAttribute: 'studentName'
    },

    findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: ClassModel,
          as: 'class'
        }];
      }
    },

    create: {
      attributes: [
        'studentId',
        'studentCode',
        'firstName',
        'lastName',
        'dateOfBirth',
      ],
      checkDuplicatedAttributes: ['studentName']
    },

    update: {
      attributes: [
        'studentId',
        'studentCode',
        'firstName',
        'lastName',
        'dateOfBirth',
      ],
      checkExistanceAttributes: ['studentId'],
      checkDuplicatedAttributes: ['studentName']
    }
  }

});
