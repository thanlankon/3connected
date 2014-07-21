/*
 * System          : 3connected
 * Component       : Course service
 * Creator         : VyBD
 * Modifier        : TrongND, UayLU
 * Created date    : 2014/06/18
 * Modified date   : 2014/07/06
 */

define.service('service.student.CourseOfStudent', function (service, require, ServiceUtil, Util) {

  var CourseOfStudentModel = require('model.student.CourseOfStudent');

  service.map = {
    url: '/student/course',
    authorize: function (req, authentication, Role, commit) {
      var authorized = Role.isStudentOrParent(authentication.accountRole);
      commit(authorized);
    },

    methods: {
      getCourseGrade: {
        url: '/getCourseGrade',
        httpMethod: 'GET'
      },
      getCourseGradeMobile: {
        url: '/getCourseGradeMobile',
        httpMethod: 'GET'
      }
    }
  };

  // find one course Student
  service.getCourseGrade = function (req, res) {

    var studentId = req.authentication.userInformationId;
    var courseId = req.query.courseId;

    var serviceResponse = {
      message: null,
      error: null,
      data: {
        items: [],
        total: 0
      }
    };

    CourseOfStudentModel.getCourseGrade(studentId, courseId, function (error, courseGrade, isNotFound) {
      if (error) {
        serviceResponse.message = 'course.student.getCourseGrade.error.unknown';
        serviceResponse.error = error;
      } else {
        if (isNotFound) {
          error = {
            code: 'ENTITY.NOT_FOUND'
          };
          serviceResponse.message = 'course.student.getCourseGrade.error.notFound';
        } else {
          serviceResponse.message = 'course.student.getCourseGrade.success';

          serviceResponse.data = {
            items: courseGrade,
            total: courseGrade.length
          };
        }
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  };

  // find one course Student for mobile
  service.getCourseGradeMobile = function (req, res) {

    var studentId = req.authentication.userInformationId;
    var courseId = req.query.courseId;

    var serviceResponse = {
      message: null,
      error: null,
      data: {
        items: [],
        total: 0
      }
    };

    CourseOfStudentModel.getCourseGrade(studentId, courseId, function (error, courseGrade, isNotFound) {
      if (error) {
        serviceResponse.message = 'course.student.getCourseGrade.error.unknown';
        serviceResponse.error = error;
      } else {
        if (isNotFound) {
          error = {
            code: 'ENTITY.NOT_FOUND'
          };
          serviceResponse.message = 'course.student.getCourseGrade.error.notFound';
        } else {

          var averageGrade = 0;
          for (var i = 0, len = courseGrade.length; i < len; i++) {
            if (courseGrade[i].value) {
              averageGrade = averageGrade + courseGrade[i].weight * courseGrade[i].value / 100;
            }
          }
          serviceResponse.data = {
            items: courseGrade,
            averageGrade: averageGrade,
            total: courseGrade.length
          };
        }
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  };

});
