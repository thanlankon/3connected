/*
 * System          : 3connected
 * Component       : Grade service
 * Creator         : UayLu
 * Created date    : 2014/06/23
 */

define.service('service.Grade', function (service, require, ServiceUtil, Util) {

  service.map = {
    url: '/grade',

    methods: {
      getCourseGrade: {
        url: '/getCourseGrade',
        httpMethod: 'GET'
      },
      updateCourseGrade: {
        url: '/updateCourseGrade',
        httpMethod: 'POST'
      }
    }
  };

  var GradeModel = require('model.Grade');

  service.getCourseGrade = function (req, res) {

    var serviceResponse = {
      error: null,
      message: null,
      data: null
    };

    var courseId = req.query.courseId;

    GradeModel.getCourseGrade(courseId, function (error, courseGrade, isNotFound) {
      if (error) {
        serviceResponse.message = 'grade.getCourseGrade.error.unknown';
        serviceResponse.error = error;
      } else {
        if (isNotFound) {
          serviceResponse.error = {
            code: 'ENTITY.NOT_FOUND'
          };
          serviceResponse.message = 'grade.getCourseGrade.notFound';
        } else {
          serviceResponse.data = courseGrade;
        }
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  };

  service.updateCourseGrade = function (req, res) {

    var serviceResponse = {
      error: null,
      message: null,
      data: null
    };

    var courseId = req.body.courseId;
    var gradeData = req.body.gradeData;
    GradeModel.updateCourseGrade(courseId, gradeData, function (error) {
      if (error) {
        serviceResponse.message = 'grade.updateCourseGrade.error.unknown';
        serviceResponse.error = error;
      } else {
        serviceResponse.message = 'grade.updateCourseGrade.success';
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  };

});
