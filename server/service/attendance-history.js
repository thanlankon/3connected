/*
 * System          : 3connected
 * Component       : Attendance history service
 * Creator         : UayLU
 * Created date    : 2014/01/07
 */
define.service('service.AttendanceHistory', function (service, require, ServiceUtil, Util) {

  var AttendanceModel = require('model.Attendance');
  var AttendanceHistotyModel = require('model.AttendanceHistory');
  var ScheduleModel = require('model.Schedule');
  var CourseModel = require('model.Course');
  var TermModel = require('model.Term');
  var MajorModel = require('model.Major');
  var StudentModel = require('model.Student');
  var StaffModel = require('model.Staff');

  service.map = {
    url: '/attendanceHistory',
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

      commit(false);
    }
  };

  service.Model = AttendanceHistotyModel;

  service.methodConfig = {
    idAttribute: 'attendanceHistoryId',

    message: {
      entityName: 'attendanceHistory',
      displayAttribute: 'attendanceHistory'
    },

    findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: AttendanceModel,
          as: 'attendance',
          include: [{
            model: ScheduleModel,
            as: 'schedule',
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
            }]
          }, {
            model: StudentModel,
            as: 'student'
          }]
        }, {
          model: StaffModel,
          as: 'staff'
          }];
      }
    }
  }

});
