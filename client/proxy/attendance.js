define.proxy('proxy.Attendance', function (proxy, require) {

  proxy.getCourseAttendance = 'GET api/attendance/getCourseAttendance';

  proxy.getCourseAttendanceStudent = 'GET api/attendance/getCourseAttendanceStudent';

  proxy.updateCourseAttendance = 'POST api/attendance/updateCourseAttendance';

  proxy.statisticCourseAttendance = 'GET api/attendance/statisticCourseAttendance';

  proxy.EntityMap = [
    {
      name: 'studentId',
      type: 'number'
    }, {
      name: 'firstName',
      type: 'string'
    }, {
      name: 'lastName',
      type: 'string'
    }, {
      name: 'totalAbsent',
      type: 'number'
    }, {
      name: 'totalPresent',
      type: 'number'
    }, {
      name: 'totalSlots',
      type: 'number'
    }, {
      name: 'percentAbsent',
      type: 'number'
    }

  ];

});
