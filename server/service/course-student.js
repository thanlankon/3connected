define.service('service.CourseStudent', function (service, require, ServiceUtil, Util) {

  var StudentModel = require('model.Student');
  var CourseModel = require('model.Course');
  var CourseStudentModel = require('model.CourseStudent');
  var SubjectModel = require('model.Subject');
  var SubjectVersionModel = require('model.SubjectVersion');
  var Term = require('model.Term');
  var MajorModel = require('model.Major');
  var ClassModel = require('model.Class');
  var BatchModel = require('model.Batch');



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
      attributes: ['courseId', 'studentId']
    },

    update: {
      attributes: ['courseId', 'studentId'],
      checkExistanceAttributes: ['courseStudentId']
    },

    findOne: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: StudentModel,
          as: 'student',
          include: [{
            model: ClassModel,
            as: 'class',
            include: [{
              model: BatchModel,
              as: 'batch'
              }, {
              model: MajorModel,
              as: 'major'
              }]
          }]
        }, {
          model: CourseModel,
          as: 'course',
          include: [{
            model: SubjectVersionModel,
            as: 'subjectVersion',
            include: [{
              model: SubjectModel,
              as: 'subject'
              }]
          }, {
            model: MajorModel,
            as: 'major'
          }, {
            model: TermModel,
            as: 'term'
          }]
        }];
      }
    }
  };

});
