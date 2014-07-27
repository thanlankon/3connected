/*
 * System          : 3connected
 * Component       : Grade service
 * Creator         : UayLu
 * Created date    : 2014/06/23
 */

define.service('service.Grade', function (service, require, ServiceUtil, Util) {

  service.map = {
    url: '/grade',

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

      var authorized = Role.isExaminator(authentication.accountRole);
      if (authorized) {
        commit(authorized);
        return;
      }

      commit(false);
    },

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
        authorize: function (req, authentication, Role, commit) {
          var authorized = Role.isStudentOrParent(authentication.accountRole);
          commit(authorized);
        },
        url: '/getSumaryGrade',
        httpMethod: 'GET'
      },
      getSumaryGradeMobile: {
        authorize: function (req, authentication, Role, commit) {
          var authorized = Role.isStudentOrParent(authentication.accountRole);
          commit(authorized);
        },
        url: '/getSumaryGradeMobile',
        httpMethod: 'GET'
      },
      statisticGradeStudent: {
        url: '/statisticGradeStudent',
        httpMethod: 'GET'
      }
    }
  };

  var GradeModel = require('model.Grade');
  var TermModel = require('model.Term');

  service.getCourseGrade = function (req, res) {

    var Role = require('enum.Role');

    var serviceResponse = {
      error: null,
      message: null,
      data: null
    };

    var courseId = req.query.courseId;
    var userId = 0;
    if (Role.isTeacher(req.authentication.accountRole)) {
      userId = req.authentication.userInformationId;
    }

    GradeModel.getCourseGrade(courseId, userId, function (error, courseGrade, isNotFound) {
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
    var userId = req.authentication.userInformationId;

    GradeModel.updateCourseGrade(courseId, gradeData, userId, function (error) {
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

    getSumaryGradeModel(termId, studentId, req, res, serviceResponse);

  };

  service.getSumaryGradeMobile = function (req, res) {

    var serviceResponse = {
      error: null,
      message: null,
      data: null
    };

    var termId = req.query.termId;
    var studentId = req.authentication.userInformationId;

    getSumaryGradeModel(termId, studentId, req, res, serviceResponse);

  };

  function getSumaryGradeModel(termId, studentId, req, res, serviceResponse) {
    if (termId, studentId) {
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
            getCourseGradeStudent(courseIds, studentId, req, res, serviceResponse);
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
  }

  function getCourseGradeStudent(courseIds, studentId, req, res, serviceResponse) {
    GradeModel.getCourseGradeStudent(courseIds, studentId, function (error, termGradeStudent, isNotFound) {
      if (termGradeStudent) {
        serviceResponse.data = {
          items: termGradeStudent.summaryGradeStudent,
          totalCreditFailed: termGradeStudent.totalCreditFailed,
          totalCredits: termGradeStudent.totalCredits,
          averageGrade: termGradeStudent.summaryGrade,
          total: termGradeStudent.summaryGradeStudent.length
        };

        ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
      }
    });
  }

  service.statisticGradeStudent = function (req, res) {

    var serviceResponse = {
      error: null,
      message: null,
      data: null
    };

    var studentId = 0;

    if (req.query.filters) {
      for (var i = 0, len = req.query.filters.length; i < len; i++) {
        if (req.query.filters[i].field == 'studentId') {
          studentId = req.query.filters[i].value;
        }
      }
    }

    GradeModel.statisticGradeStudent(studentId, function (error, statisticGradeStudent, isNotFound) {
      if (error) {
        serviceResponse.message = 'grade.statisticGradeStudent.error.unknown';
        serviceResponse.error = error;
      } else {
        if (isNotFound) {
          serviceResponse.error = {
            code: 'ENTITY.NOT_FOUND'
          };
          serviceResponse.message = 'grade.statisticGradeStudent.notFound';
        } else {
          serviceResponse.data = {
            items: statisticGradeStudent.summaryGradeStudent,
            totalCreditFailed: statisticGradeStudent.totalCreditFailed,
            totalCredits: statisticGradeStudent.totalCredits,
            averageGrade: statisticGradeStudent.averageGrade,
            accumulationGrade: statisticGradeStudent.accumulationGrade,
            totalCreditCurrentLearn: statisticGradeStudent.totalCreditCurrentLearn,
            total: statisticGradeStudent.summaryGradeStudent.length
          };
          ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
        }
      }
    });

  };

});
