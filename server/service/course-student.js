define.service('service.CourseStudent', function (service, require, ServiceUtil, Util) {

  var StudentModel = require('model.Student');
  var CourseModel = require('model.Course');
  var CourseStudentModel = require('model.CourseStudent');

  service.map = {
    url: '/courseStudent'
  };

  service.Model = CourseStudentModel;

  service.methodConfig = {
    idAttribute: 'courseStudentId',

    message: {
      entityName: 'courseStudent',
      displayAttribute: 'courseStudent'
    },

    findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: StudentModel,
          as: 'student'
        }, {
          model: CourseModel,
          as: 'course'
        }];
      }
    },

    create: {
      attributes: ['studentId', 'courseId']
    },

    update: {
      attributes: ['studentId', 'courseId'],
      checkExistanceAttributes: ['courseStudentId']
    },

    findOne: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: StudentModel,
          as: 'student'
        }, {
          model: CourseModel,
          as: 'course'
        }];
      }
    }
  };

});
