define.proxy('proxy.Attendance', function (proxy, require) {

  proxy.getCourseAttendance = 'GET api/attendance/getCourseAttendance';

  proxy.getCourseAttendanceStudent = 'GET api/attendance/getCourseAttendanceStudent';

  proxy.updateCourseAttendance = 'POST api/attendance/updateCourseAttendance';

});
