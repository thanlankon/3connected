/*
 * System          : 3connected
 * Component       : Attendance service
 * Creator         : TrongND
 * Created date    : 2014/06/23
 */

define.service('service.Attendance', function (service, require, ServiceUtil, Util) {

  service.map = {
    url: '/attendance',

    authorize: function (req, authentication, Role, commit) {
      // check for staff
      var authorized = Role.isEducator(authentication.accountRole);
      if (authorized) {
        commit(authorized);
        return;
      }

      var authorized = Role.isTeacher(authentication.accountRole);
      if (authorized) {
        commit(authorized);
        return;
      }

      commit(false);
    },

    methods: {
      getCourseAttendance: {
        url: '/getCourseAttendance',
        httpMethod: 'GET'
      },
      getCourseAttendanceStudent: {
        authorize: function (req, authentication, Role, commit) {
          var authorized = Role.isStudentOrParent(authentication.accountRole);
          commit(authorized);
        },
        url: '/getCourseAttendanceStudent',
        httpMethod: 'GET'
      },
      updateCourseAttendance: {
        url: '/updateCourseAttendance',
        httpMethod: 'POST'
      },
      statisticCourseAttendance: {
        url: '/statisticCourseAttendance',
        httpMethod: 'GET'
      }
    }
  };

  var AttendanceModel = require('model.Attendance');

  service.getCourseAttendance = function (req, res) {

    var Role = require('enum.Role');

    var serviceResponse = {
      error: null,
      message: null,
      data: null
    };

    var courseId = req.query.courseId;
    var scheduleId = req.query.scheduleId;
    var userId = 0;
    if (Role.isTeacher(req.authentication.accountRole)) {
      userId = req.authentication.userInformationId;
    }

    var isEducator = Role.isEducator(req.authentication.accountRole);

    AttendanceModel.getCourseAttendance(courseId, scheduleId, userId, isEducator, function (error, courseAttendance, isNotFound) {
      if (error) {
        serviceResponse.message = 'course.getCourseAttendance.error.unknown';
        serviceResponse.error = error;
      } else {
        if (isNotFound) {
          serviceResponse.error = {
            code: 'ENTITY.NOT_FOUND'
          };
          serviceResponse.message = 'course.getCourseAttendance.notFound';
        } else {
          serviceResponse.data = courseAttendance;
        }
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  };

  service.getCourseAttendanceStudent = function (req, res) {

    var Role = require('enum.Role');

    var serviceResponse = {
      error: null,
      message: null,
      data: null
    };

    var courseId = req.query.courseId;
    var scheduleId = req.query.scheduleId;
    var userId = 0;
    if (Role.isTeacher(req.authentication.accountRole)) {
      userId = req.authentication.userInformationId;
    }

    AttendanceModel.getCourseAttendance(courseId, scheduleId, userId, function (error, courseAttendance, isNotFound) {
      if (error) {
        serviceResponse.message = 'course.getCourseAttendance.error.unknown';
        serviceResponse.error = error;
      } else {
        if (isNotFound) {
          serviceResponse.error = {
            code: 'ENTITY.NOT_FOUND'
          };
          serviceResponse.message = 'course.getCourseAttendance.notFound';
        } else {
          serviceResponse.data = courseAttendance;
        }
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  };

  service.updateCourseAttendance = function (req, res) {

    var serviceResponse = {
      error: null,
      message: null,
      data: null
    };

    var scheduleId = req.body.scheduleId;
    var attendanceData = req.body.attendanceData;
    var userId = req.authentication.userInformationId;

    AttendanceModel.updateCourseAttendance(scheduleId, attendanceData, userId, function (error) {
      if (error) {
        serviceResponse.message = 'course.updateCourseAttendance.error.unknown';
        serviceResponse.error = error;
      } else {
        serviceResponse.message = 'course.updateCourseAttendance.success';
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  };

  service.statisticCourseAttendance = function (req, res) {

    var serviceResponse = {
      error: null,
      message: null,
      data: null
    };

    var courseId = 0;
    if (req.query.filters) {
      for (var i = 0, len = req.query.filters.length; i < len; i++) {
        if (req.query.filters[i].field == 'courseId') {
          courseId = req.query.filters[i].value;
        }
      }
    }


    if (courseId == 0) {
      serviceResponse.error = {
        code: 'ENTITY.NOT_FOUND'
      };
      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
      return;
    }

    AttendanceModel.statisticCourseAttendance(courseId, function (error, courseAttendance, isNotFound) {
      if (error) {
        serviceResponse.message = 'course.statisticCourseAttendance.error.unknown';
        serviceResponse.error = error;
      } else {
        if (isNotFound) {
          serviceResponse.error = {
            code: 'ENTITY.NOT_FOUND'
          };
          serviceResponse.data = null;
        } else {
          serviceResponse.data = {
            items: courseAttendance,
            total: courseAttendance.length
          };
        }
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  };

});
