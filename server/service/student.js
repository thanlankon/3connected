define.service('service.Student', function (service, require, ServiceUtil, Util) {

  var StudentModel = require('model.Student');
  var ClassModel = require('model.Class');
  var BatchModel = require('model.Batch');
  var MajorModel = require('model.Major');

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
          as: 'class',
          include: [{
            model: BatchModel,
            as: 'batch'
          }, {
            model: MajorModel,
            as: 'major'
          }]
        }];
      }
    },

    create: {
      attributes: [
        'studentCode',
        'firstName',
        'lastName',
        'gender',
        'dateOfBirth',
        'address',
        'email',
        'classId'
      ],
      checkDuplicatedAttributes: ['studentCode']
    },

    update: {
      attributes: [
        'studentId',
        'studentCode',
        'firstName',
        'lastName',
        'gender',
        'dateOfBirth',
        'address',
        'email',
        'classId'
      ],
      checkExistanceAttributes: ['studentId'],
      checkDuplicatedAttributes: ['studentCode']
    }
  }

});