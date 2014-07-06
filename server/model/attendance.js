define.model('model.Attendance', function (model, ModelUtil, require) {

  var Attendance = require('model.entity.Attendance');
  var AttendanceHistory = require('model.entity.AttendanceHistory');
  var Student = require('model.entity.Student');
  var Course = require('model.entity.Course');
  var Schedule = require('model.entity.Schedule');
  var CourseStudent = require('model.entity.CourseStudent');
  var Entity = require('core.model.Entity');

  var AttendanceStatus = require('enum.Attendance');

  model.Entity = Attendance;

  model.getCourseAttendance = function (courseId, scheduleId, callback) {

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

    queryChainer.add(Schedule.findAll({
      where: {
        courseId: courseId
      },
      include: [{
        model: Attendance,
        as: 'attendances'
      }]
    }));

    queryChainer.run()
      .success(function (results) {
        var schedule = results[0];
        var courseSchedules = results[1];

        var totalSlots = courseSchedules.length;

        if (schedule == null || courseSchedules == null) {
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

        // attendance statistics
        var statistics = {
          totalSlots: totalSlots,
          studentAttendances: {}
        };

        var studentAttendances = statistics.studentAttendances;

        for (var i = 0, len = students.length; i < len; i++) {
          var student = students[i];

          studentAttendances[student.studentId] = {
            totalPresents: 0,
            totalAbsents: 0
          };
        }

        var courseAttendances = schedule.attendances;

        for (var i = 0, scheduleLen = courseSchedules.length; i < scheduleLen; i++) {
          var scheduleAttendances = courseSchedules[i].attendances;
          for (var j = 0, attendanceLen = scheduleAttendances.length; j < attendanceLen; j++) {
            var scheduleAttendance = scheduleAttendances[j];
            var scheduleAttendance = scheduleAttendances[j];

            if (scheduleAttendance.status == AttendanceStatus.PRESENT) {
              studentAttendances[scheduleAttendance.studentId].totalPresents += 1
            } else if (scheduleAttendance.status == AttendanceStatus.ABSENT) {
              studentAttendances[scheduleAttendance.studentId].totalAbsents += 1
            }
          }
        }

        var isLocked = checkIfAttendanceIsLocked(schedule.date, schedule.slot);

        var courseAttendanceData = {
          students: students,
          attendances: attendances,
          statistics: statistics,
          isLocked: isLocked
        };

        callback(null, courseAttendanceData, false);
      })
      .error(function (error) {
        callback(error);
      });

  };

  model.updateCourseAttendance = function (scheduleId, attendanceData, callback) {

    if (!attendanceData || !attendanceData.length) {
      callback(null);
      return;
    }

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

      var findOrCreateQueryChainer = Entity.queryChainer();

      attendances.forEach(function (attendance) {
        findOrCreateQueryChainer.add(Attendance.findOrCreate({
          attendanceId: attendance.attendanceId
        }, {
          studentId: attendance.studentId,
          scheduleId: attendance.scheduleId,
          status: attendance.status
        }));
      });

      findOrCreateQueryChainer
        .run()
        .success(function (results) {
          var updateAndLogHistoryQueryChainer = Entity.queryChainer();

          results.forEach(function (attendance, index) {
            var attendanceData = attendances[index];

            if (attendanceData.attendanceId) {
              // update attendance status and log history
              // only if status has changed
              if (attendanceData.status != attendance.status) {
                var oldValue = attendance.status;
                var newValue = attendanceData.status;

                // update attendance status
                updateAndLogHistoryQueryChainer.add(attendance.updateAttributes({
                  status: newValue
                }, {
                  transaction: transaction
                }));

                // log history
                updateAndLogHistoryQueryChainer.add(AttendanceHistory.create({
                  attendanceId: attendance.attendanceId,
                  staffId: null,
                  oldValue: oldValue,
                  newValue: newValue
                }, {
                  transaction: transaction
                }));
              }
            } else {
              var oldValue = null;
              var newValue = attendanceData.status;

              // log history for created attendance
              updateAndLogHistoryQueryChainer.add(AttendanceHistory.create({
                attendanceId: attendance.attendanceId,
                staffId: null,
                oldValue: oldValue,
                newValue: newValue
              }, {
                transaction: transaction
              }));
            }
          });

          updateAndLogHistoryQueryChainer
            .run()
            .success(function () {
              transaction.commit();
              callback(null);
            })
            .error(function (error) {
              transaction.rollback();
              callback(error);
            });

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
    slotStartTime = Moment(slotStartTime, DateTimeConstant.Format.DATE_TIME);

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
