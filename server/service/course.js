/*
 * System          : 3connected
 * Component       : Course service
 * Creator         : VyBD
 * Created date    : 2014/18/06
 */
define.service('service.Course', function (service, require, ServiceUtil, Util) {

  var CourseModel = require('model.Course');
  var SubjectModel = require('model.Subject');
  var SubjectVersionModel = require('model.SubjectVersion');
  var ClassModel = require('model.Class');
  //  var LectureModel = require('model.Lecture');
  var TermModel = require('model.Term');
  var MajorModel = require('model.Major');

  service.map = {
    url: '/course'
  };

  service.Model = CourseModel;

  service.methodConfig = {
    idAttribute: 'courseId',

    message: {
      entityName: 'course',
      displayAttribute: 'courseName'
    },

    create: {
      attributes: ['classId', 'courseName', 'numberOfCredits', 'lectureId', 'subjectVersionId', 'termId', 'majorId'],
      checkDuplicatedAttributes: ['courseName']
    },

    update: {
      attributes: ['classId', 'courseName', 'numberOfCredits', 'lectureId', 'subjectVersionId', 'termId', 'majorId'],
      checkExistanceAttributes: ['courseId'],
      checkDuplicatedAttributes: ['courseName']
    },

    findOne: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: SubjectVersionModel,
          as: 'subjectVersion',
          include: [{
            model: SubjectModel,
            as: 'subject'
          }]
        }, {
          model: ClassModel,
          as: 'class'
        }, {
          model: TermModel,
          as: 'term'
        }, {
          model: MajorModel,
          as: 'major'
        }];
      }
    },

    findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: SubjectVersionModel,
          as: 'subjectVersion',
          include: [{
            model: SubjectModel,
            as: 'subject'
          }]
        }, {
          model: ClassModel,
          as: 'class'
        }, {
          model: TermModel,
          as: 'term'
        }, {
          model: MajorModel,
          as: 'major'
        }];
      }
    }
  }

});
