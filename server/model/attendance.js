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

        var isLocked = checkIfAttendanceIsLocked(schedule.date, schedule.slot);

        var courseAttendanceData = {
          students: students,
          attendances: attendances,
          isLocked: isLocked
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

  function checkIfAttendanceIsLocked(date, slot, skipCheckAfter, skipCheckBefore) {

    var DateTimeConstant = require('constant.DateTime');
    var AttendanceConfig = require('config.Attendance');
    var Moment = require('lib.Moment');

    var slotConfig = AttendanceConfig.Slots['SLOT' + slot];
    var currentTime = Moment.utc();
    var isLocked = false;

    // get string of date: DD/MM/YYYY HH:mm
    var slotStartTime = date + ' ' + slotConfig.START;
    // convert string of date to date object
    slotStartTime = Moment.utc(slotStartTime, DateTimeConstant.Format.DATE_TIME);

    // check lock before starting slot
    if (!isLocked && !skipCheckBefore && AttendanceConfig.LOCK_BEFORE_STARTING !== false) {
      var duration = AttendanceConfig.LOCK_BEFORE_STARTING;

      var beforeStartingTime = Moment(slotStartTime);
      beforeStartingTime.subtract(duration, 'minutes');

      var diff = currentTime.diff(beforeStartingTime);

      isLocked = (diff <= 0);
    }

    // check lock after starting slot
    if (!isLocked && !skipCheckAfter && AttendanceConfig.LOCK_AFTER_STARTING !== false) {
      var duration = AttendanceConfig.LOCK_AFTER_STARTING;

      var afterStartingTime = Moment(slotStartTime);
      afterStartingTime.add(duration, 'minutes');

      var diff = currentTime.diff(afterStartingTime);

      isLocked = (diff >= 0);
    }

    // check lock after ending slot
    if (!isLocked && !skipCheckAfter && AttendanceConfig.LOCK_AFTER_ENDING !== false) {
      var duration = slotConfig.DURATION || AttendanceConfig.SLOT_DURATION;
      duration += AttendanceConfig.LOCK_AFTER_ENDING;

      var afterEndingTime = Moment(slotStartTime);
      afterEndingTime.add(duration, 'minutes');

      var diff = currentTime.diff(afterEndingTime);

      isLocked = (diff >= 0);
    }

    return isLocked;
  }

});
