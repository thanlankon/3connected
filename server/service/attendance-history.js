/*
 * System          : 3connected
 * Component       : Attendance history service
 * Creator         : UayLU
 * Created date    : 2014/01/07
 */
define.service('service.AttendanceHistory', function (service, require, ServiceUtil, Util) {

  var AttendanceHistoryModel = require('model.AttendanceHistory');
  var AttendanceModel = require('model.Attendance');
  var ScheduleModel = require('model.Schedule');

  service.map = {
    url: '/attendanceHistory'
  };

  service.Model = AttendanceHistoryModel;

  service.methodConfig = {
    idAttribute: 'attendanceHistoryId',

    message: {
      entityName: 'attendanceHistory',
      displayAttribute: 'attendanceHistory'
    },

//    findAll: {
  //      buildFindOptions: function (findOptions) {
  //          findOptions.include = [{
  //            model: AttendanceModel,
  //            as: 'attendance',
  //            include: [{
  //              model: ScheduleModel,
  //              as: 'schedule'
  //            }]
  //          }];
  //        }
  //    }
  }

});
