/*
 * System          : 3connected
 * Component       : Course service
 * Creator         : VyBD
 * Modifier        : TrongND, UayLU
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
    authorize: function (req, authentication, Role, commit) {
      // check for staff
      var authorized = Role.isStaff(authentication.accountRole);
      if (authorized) {
        commit(authorized);
        return;
      }

      // check for student or parent
      var authorized = Role.isStudentOrParent(authentication.accountRole);
      if (authorized) {
        commit(authorized);
        return;
      }

      commit(false);
    },

    methods: {
      updateSchedule: {
        url: '/updateSchedule',
        httpMethod: 'POST'
      },
      findAttendanceStudent: {
        authorize: function (req, authentication, Role, commit) {
          var authorized = Role.isStudentOrParent(authentication.accountRole);
          commit(authorized);
        },
        url: '/findAttendanceStudent',
        httpMethod: 'GET'
      },
      findCourseStudent: {
        authorize: function (req, authentication, Role, commit) {
          var authorized = Role.isStudentOrParent(authentication.accountRole);
          commit(authorized);
        },
        url: '/findCourseStudent',
        httpMethod: 'GET'
      },
      findCourseStudentMobile: {
        authorize: function (req, authentication, Role, commit) {
          var authorized = Role.isStudentOrParent(authentication.accountRole);
          commit(authorized);
        },
        url: '/findCourseStudentMobile',
        httpMethod: 'GET'
      },
      findOneCourseStudent: {
        authorize: function (req, authentication, Role, commit) {
          var authorized = Role.isStudentOrParent(authentication.accountRole);
          commit(authorized);
        },
        url: '/findOneCourseStudent',
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

    var studentId = req.authentication.userInformationId;
    var courseId = req.query.courseId;

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

  // find course Attendance Student for mobile
  service.findCourseStudentMobile = function (req, res) {

    //    var studentId = req.body.studentId;
    //    var courseId = req.body.courseId;

    var studentId = req.authentication.userInformationId;

    var serviceResponse = {
      message: null,
      error: null
    };

    var findOptions = ServiceUtil.buildFindOptions(req.query);

    CourseModel.findCourseStudent(studentId, findOptions, function (error, courseStudent, isNotFound) {
      if (error) {
        serviceResponse.message = 'course.findCourseAttendanceStudent.error';
        serviceResponse.error = error;
      } else {
        if (isNotFound) {
          serviceResponse.error = {
            code: 'ENTITY.NOT_FOUND'
          };
          serviceResponse.message = 'course.findCourseAttendanceStudent.notFound';
        } else {
          var courseStudentMobile = [];
          for (var i = 0, len = courseStudent.items.length; i < len; i++) {
            courseStudentMobile.push({
              courseId: courseStudent.items[i].course.courseId,
              courseName: courseStudent.items[i].course.courseName,
              termId: courseStudent.items[i].course.term.termId,
              termName: courseStudent.items[i].course.term.termName
            });
          }

          var findResult = {
            items: courseStudentMobile,
            total: courseStudentMobile.length
          };

          serviceResponse.data = findResult;
        }
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  };

  // find course Attendance Student
  service.findCourseStudent = function (req, res) {

    //    var studentId = req.body.studentId;
    //    var courseId = req.body.courseId;

    var studentId = req.authentication.userInformationId;

    var serviceResponse = {
      message: null,
      error: null
    };

    var findOptions = ServiceUtil.buildFindOptions(req.query);

    CourseModel.findCourseStudent(studentId, findOptions, function (error, courseStudent, isNotFound) {
      if (error) {
        serviceResponse.message = 'course.findCourseAttendanceStudent.error';
        serviceResponse.error = error;
      } else {
        if (isNotFound) {
          serviceResponse.error = {
            code: 'ENTITY.NOT_FOUND'
          };
          serviceResponse.message = 'course.findCourseAttendanceStudent.notFound';
        } else {
          serviceResponse.data = courseStudent;
        }
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  };

  // find one course Student
  service.findOneCourseStudent = function (req, res) {

    //    var studentId = req.body.studentId;
    //    var courseId = req.body.courseId;

    var courseId = req.query.courseId;

    var serviceResponse = {
      message: null,
      error: null
    };


    CourseModel.findOneCourseStudent(courseId, function (error, course, isNotFound) {
      if (error) {
        serviceResponse.message = 'course.findOneCourseStudent.error';
        serviceResponse.error = error;
      } else {
        if (isNotFound) {
          serviceResponse.error = {
            code: 'ENTITY.NOT_FOUND'
          };
          serviceResponse.message = 'course.findOneCourseStudent.notFound';
        } else {
          serviceResponse.data = course;
        }
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  };

});
