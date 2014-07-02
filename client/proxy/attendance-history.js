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
      name: 'newsValue',
      type: 'number'
    },
 //    {
 //      name: 'time',
 //      type: 'number'
 //    },
 //    {
 //      name: 'attendanceId',
 //      type: 'number'
 //    },
 //    {
 //      name: 'staffId',
 //      type: 'number'
 //    },
 //    {
 //      name: 'scheduleId',
 //      type: 'number',
 //      map: 'attendance.schedule.scheduleId'
 //    },
 //    {
 //      name: 'date',
 //      type: 'number',
 //      map: 'attendance.schedule.date'
 //    },
 //    {
 //      name: 'slot',
 //      type: 'number',
 //      map: 'attendance.schedule.slot'
 //    }
  ];

});
