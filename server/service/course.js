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
  var Schedule = require('model.entity.Schedule');

  service.map = {
    url: '/course',

    methods: {
      updateSchedule: {
        url: '/updateSchedule',
        httpMethod: 'POST'
      }
    }
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
        }, {
          entity: Schedule,
          as: 'schedules'
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
  };

  // schedule
  service.updateSchedule = function (req, res) {

    var addedItems = req.body.addedItems;
    var removedItems = req.body.removedItems;
    var courseId = req.body.courseId;

    var serviceResponse = {
      message: null,
      error: null
    };

    // add new slots
    if (!serviceResponse.error && addedItems && addedItems.length) {

      CourseModel.addScheduleSlots(courseId, addedItems, function (error, addedItems) {
        if (error) {
          serviceResponse.message = 'course.updateSchedule.error.addScheduleSlots';
          serviceResponse.error = error;
        }
      });

    }

    if (!serviceResponse.error && removedItems && removedItems.length) {}

    if (!serviceResponse.error) {
      serviceResponse.message = 'course.updateSchedule.success';
    };

    ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message);

  };

});
