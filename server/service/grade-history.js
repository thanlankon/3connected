/*
 * System          : 3connected
 * Component       : Grade history service
 * Creator         : UayLU
 * Created date    : 2014/01/07
 */
define.service('service.GradeHistory', function (service, require, ServiceUtil, Util) {

  var GradeModel = require('model.Grade');
  var GradeHistotyModel = require('model.GradeHistory');
  var CourseModel = require('model.Course');
  var TermModel = require('model.Term');
  var MajorModel = require('model.Major');
  var StudentModel = require('model.Student');
  var GradeCategoryModel = require('model.GradeCategory');
  var StaffModel = require('model.Staff');


  service.map = {
    url: '/gradeHistory',
    authorize: function (req, authentication, Role, commit) {
      // check for staff
      var authorized = Role.isEducator(authentication.accountRole);
      if (authorized) {
        commit(authorized);
        return;
      }

      authorized = Role.isAdministrator(authentication.accountRole);
      if (authorized) {
        commit(authorized);
        return;
      }

      authorized = Role.isExaminator(authentication.accountRole);
      if (authorized) {
        commit(authorized);
        return;
      }

      commit(false);
    }
  };

  service.Model = GradeHistotyModel;

  service.methodConfig = {
    idAttribute: 'gradeHistoryId',

    message: {
      entityName: 'gradeHistory',
      displayAttribute: 'gradeHistory'
    },

    findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: GradeModel,
          as: 'grade',
          include: [{
            model: CourseModel,
            as: 'course',
            include: [{
              model: TermModel,
              as: 'term'
              }, {
              model: MajorModel,
              as: 'major'
              }]
            }, {
            model: StudentModel,
            as: 'student'
            }, {
            model: GradeCategoryModel,
            as: 'gradeCategory'
            }]
        }, {
          model: StaffModel,
          as: 'staff'
        }];
      }
    }
  }

});
