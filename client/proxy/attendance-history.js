/*
 * System          : 3connected
 * Component       : Attendance history proxy
 * Creator         : UayLU
 * Created date    : 2014/01/07
 */
define.proxy('proxy.AttendanceHistory', function (proxy, require) {

  proxy.entityId = 'attendanceHistoryId';

  proxy.findAll = 'GET api/attendanceHistory/findAll';

  proxy.findOne = 'GET api/attendanceHistory/findOne';

  // attendance history entity map
  proxy.EntityMap = [
    {
      name: 'attendanceHistoryId',
      type: 'number'
    },
    {
      name: 'oldValue',
      type: 'number'
    },
    {
      name: 'newValue',
      type: 'number'
    },
    {
      name: 'time',
      type: 'string'
    }, {
      name: 'attendanceId',
      type: 'number'
    }, {
      name: 'staffId',
      type: 'number'
    }, {
      name: 'scheduleId',
      type: 'number',
      map: 'attendance.schedule.scheduleId'
    }, {
      name: 'date',
      type: 'number',
      map: 'attendance.schedule.date'
    }, {
      name: 'slot',
      type: 'number',
      map: 'attendance.schedule.slot'
    }, {
      name: 'courseName',
      type: 'number',
      map: 'attendance.schedule.course.courseName'
    }, {
      name: 'termName',
      type: 'number',
      map: 'attendance.schedule.course.term.termName'
    }, {
      name: 'majorName',
      type: 'number',
      map: 'attendance.schedule.course.major.majorName'
    }
  ];

});
