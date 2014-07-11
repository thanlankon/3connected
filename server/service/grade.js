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
      },
      getSumaryGrade: {
        url: '/getSumaryGrade',
        httpMethod: 'GET'
      }
    }
  };

  var GradeModel = require('model.Grade');
  var TermModel = require('model.Term');

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

  service.getSumaryGrade = function (req, res) {

    var serviceResponse = {
      error: null,
      message: null,
      data: null
    };

    var termId = 0;
    if (req.query.filters) {
      for (var i = 0, len = req.query.filters.length; i < len; i++) {
        if (req.query.filters[i].field == 'termId') {
          termId = req.query.filters[i].value;
        }
      }
    }
    var studentId = req.authentication.userInformationId;

    console.log('termId ' + termId);

    if (termId) {
      TermModel.getTermCourseStudent(termId, studentId, function (error, terms, isNotFound) {
        if (error) {
          serviceResponse.message = 'grade.getTermCourseStudent.error.unknown';
          serviceResponse.error = error;
        } else {
          if (isNotFound) {
            serviceResponse.error = {
              code: 'ENTITY.NOT_FOUND'
            };
            serviceResponse.message = 'grade.getTermCourseStudent.notFound';
          } else {
            var courseIds = [];
            if (terms.length) {
              var courses = terms[0].courses;
              for (var i = 0, len = courses.length; i < len; i++) {
                courseIds.push(courses[i].courseId);
              }
            }
            getCourseGradeStudent(courseIds, studentId);
          }
        }
      });
    } else {
      var items = [];
      var total = [];
      serviceResponse.data = {
        items: items,
        total: total
      };
      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    }

    function getCourseGradeStudent(courseIds, studentId) {
      GradeModel.getCourseGradeStudent(courseIds, studentId, function (error, termGradeStudent, isNotFound) {
        if (termGradeStudent) {

          serviceResponse.data = {
            items: termGradeStudent.summaryGradeStudent,
            averageGrade: termGradeStudent.summaryGrade,
            total: termGradeStudent.summaryGradeStudent.length
          };

          ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
        }
      });
    }

  };

});
