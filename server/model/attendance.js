define.model('model.Attendance', function (model, ModelUtil, require) {

  var Attendance = require('model.entity.Attendance');
  var Student = require('model.entity.Student');
  var Course = require('model.entity.Course');
  var Schedule = require('model.entity.Schedule');
  var CourseStudent = require('model.entity.CourseStudent');
  var Entity = require('core.model.Entity');

  model.getCourseAttendance = function (scheduleId, callback) {

    var queryChainer = Entity.queryChainer();

    queryChainer
      .add(Schedule.find({
        where: {
          scheduleId: scheduleId
        },
        include: [{
          model: Attendance,
          as: 'attendances'
        }, {
          model: Course,
          as: 'course',
          include: [{
            model: CourseStudent,
            as: 'courseStudents',
            include: [{
              model: Student,
              as: 'student'
            }]
          }]
        }]
      }));

    queryChainer.run()
      .success(function (results) {
        var schedule = results[0];

        if (schedule == null) {
          callback(null, null, true);

          return;
        }

        // course students
        var students = [];
        var courseStudents = schedule.course.courseStudents;

        for (var i = 0, len = courseStudents.length; i < len; i++) {
          var student = courseStudents[i].student;

          students.push({
            studentId: student.studentId,
            studentCode: student.studentCode,
            firstName: student.firstName,
            lastName: student.lastName
          });
        }

        // course attendances
        var attendances = [];
        var courseAttendances = schedule.attendances;

        for (var i = 0, len = courseAttendances.length; i < len; i++) {
          var attendance = courseAttendances[i];

          attendances.push({
            attendanceId: attendance.attendanceId,
            studentId: attendance.studentId,
            status: attendance.status
          });
        }

        var courseAttendanceData = {
          students: students,
          attendances: attendances
        };

        callback(null, courseAttendanceData, false);
      })
      .error(function (error) {
        callback(error);
      });

  };

  model.updateCourseAttendance = function (scheduleId, attendanceData, callback) {

    var attendances = [];

    for (var i = 0, len = attendanceData.length; i < len; i++) {
      var attendance = {
        attendanceId: attendanceData[i].attendanceId,
        scheduleId: scheduleId,
        studentId: attendanceData[i].studentId,
        status: attendanceData[i].status
      };

      attendances.push(attendance);
    }

    Entity.transaction(function (transaction) {

      var queryChainer = Entity.queryChainer();

      attendances.forEach(function (attendance) {
        if (attendance.attendanceId) {
          queryChainer.add(Attendance.update({
            status: attendance.status
          }, {
            attendanceId: attendance.attendanceId
          }, {
            transaction: transaction
          }));
        } else {
          queryChainer.add(Attendance.create({
            studentId: attendance.studentId,
            scheduleId: attendance.scheduleId,
            status: attendance.status
          }, {
            transaction: transaction
          }));
        }
      });

      queryChainer
        .run()
        .success(function () {
          transaction.commit();
          callback(null);
        })
        .error(function (errors) {
          transaction.rollback();
          callback(errors);
        });

    });

  };

});
