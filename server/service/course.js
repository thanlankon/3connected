/*
 * System          : 3connected
 * Component       : Course service
 * Creator         : VyBD
 * Modifier        : TrongND
 * Created date    : 2014/06/18
 * Modified date   : 2014/07/06
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
    authorize: function(req, authentication, Role, commit) {
      var authorized = Role.isStaff(authentication.accountRole);
      commit(authorized);
    },

    methods: {
      updateSchedule: {
        url: '/updateSchedule',
        httpMethod: 'POST'
      },
      findAttendanceStudent: {
        url: '/findAttendanceStudent',
        httpMethod: 'GET'
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

    var removedIds = [];

    if (removedItems && removedItems.length) {
      var removedIds = [];

      for (var i = 0, len = removedItems.length; i < len; i++) {
        removedIds.push(removedItems[i].scheduleId);
      }
    }

    CourseModel.updateScheduleSlots(courseId, addedItems, removedIds, function (error, isAddError, isRemoveError) {
      if (error) {
        if (isAddError) {
          serviceResponse.message = 'course.updateSchedule.error.addScheduleSlots';
        }
        if (isRemoveError) {
          serviceResponse.message = 'course.updateSchedule.error.removeScheduleSlots';
        }
        serviceResponse.error = error;
      } else {
        serviceResponse.message = 'course.updateSchedule.success';
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message);
    });

  };

  // find Attendance Student
  service.findAttendanceStudent = function (req, res) {

    //    var studentId = req.body.studentId;
    //    var courseId = req.body.courseId;

    var studentId = 1;
    var courseId = 1;

    var serviceResponse = {
      message: null,
      error: null
    };


    CourseModel.findAttendanceStudent(courseId, studentId, function (error, attendanceStudent, isNotFound) {
      if (error) {
        serviceResponse.message = 'course.findAttendanceStudent.error';
        serviceResponse.error = error;
      } else {
        if (isNotFound) {
          serviceResponse.error = {
            code: 'ENTITY.NOT_FOUND'
          };
          serviceResponse.message = 'course.findAttendanceStudent.notFound';
        } else {
          serviceResponse.data = attendanceStudent;
        }
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  };

});
