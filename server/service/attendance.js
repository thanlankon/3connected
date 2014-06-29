/*
 * System          : 3connected
 * Component       : Attendance service
 * Creator         : TrongND
 * Created date    : 2014/06/23
 */

define.service('service.Attendance', function (service, require, ServiceUtil, Util) {

  service.map = {
    url: '/attendance',

    methods: {
      getCourseAttendance: {
        url: '/getCourseAttendance',
        httpMethod: 'GET'
      },
      updateCourseAttendance: {
        url: '/updateCourseAttendance',
        httpMethod: 'POST'
      }
    }
  };

  var AttendanceModel = require('model.Attendance');

  service.getCourseAttendance = function (req, res) {

    var serviceResponse = {
      error: null,
      message: null,
      data: null
    };

    var courseId = req.query.courseId;
    var scheduleId = req.query.scheduleId;

    AttendanceModel.getCourseAttendance(courseId, scheduleId, function (error, courseAttendance, isNotFound) {
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

    AttendanceModel.updateCourseAttendance(scheduleId, attendanceData, function (error) {
      if (error) {
        serviceResponse.message = 'course.updateCourseAttendance.error.unknown';
        serviceResponse.error = error;
      } else {
        serviceResponse.message = 'course.updateCourseAttendance.success';
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  };

});
