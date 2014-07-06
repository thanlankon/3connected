/*
 * System          : 3connected
 * Component       : Course model
 * Creator         : VyBD
 * Modifier        : TrongND, UayLu
 * Created date    : 2014/06/17
 * Modified date   : 2014/06/23
 */

define.model('model.Course', function (model, ModelUtil, require) {

  var Course = require('model.entity.Course');
  var Schedule = require('model.entity.Schedule');
  var Attendance = require('model.entity.Attendance');
  var SubjectVersion = require('model.entity.SubjectVersion');
  var Subject = require('model.entity.Subject');
  var Class = require('model.entity.Class');
  var Term = require('model.entity.Term');
  var Major = require('model.entity.Major');
  var CourseStudent = require('model.entity.CourseStudent');

  model.Entity = Course;

  model.addScheduleSlots = function (courseId, slots, callback) {

    var scheduleItems = [];

    slots = slots || [];

    for (var i = 0, len = slots.length; i < len; i++) {
      var slot = slots[i];

      if (!slot['date'] || !slot['slot']) continue;

      scheduleItems.push({
        courseId: courseId,
        date: slot.date,
        slot: slot.slot
      });
    }

    Schedule.bulkCreate(scheduleItems)
      .success(function () {
        callback(null, scheduleItems)
      })
      .error(function (error) {
        callback(error);
      });

  };

  model.removeScheduleSlots = function (scheduleIds, callback) {

    var findConditions = {
      scheduleId: scheduleIds
    };

    Schedule.destroy(findConditions)
      .success(function (affectedRows) {
        callback(null, affectedRows);
      })
      .error(function (error) {
        callback(error);
      });

  };

  model.updateScheduleSlots = function (courseId, addedItems, removedIds, callback) {

    model.addScheduleSlots(courseId, addedItems, function (addError, addedItems) {
      if (addError) {
        callback(addError, true, false);
      } else {
        model.removeScheduleSlots(removedIds, function (removeError, affectedRows) {
          if (removeError) {
            callback(removeError, false, true);
          } else {
            callback(null, false, false);
          }
        });
      }
    });

  };


  model.findAttendanceStudent = function (courseId, studentId, callback) {

    // find the Course
    Course.findAll({
      include: [{
        model: Schedule,
        as: 'schedules',
        include: [{
          model: Attendance,
          as: 'attendances',
          where: {
            studentId: studentId
          }
        }]
      }],
      where: {
        courseId: courseId
      },
      order: 'schedules.date'

    })
      .success(function (attendanceStudent) {
        callback(null, attendanceStudent, false);
      })
      .error(function (error) {
        callback(error);
      });
  };

  model.findCourseStudent = function (studentId, callback) {

    // find the Course
    Course.findAll({
      include: [{
        model: SubjectVersion,
        as: 'subjectVersion',
        include: [{
          model: Subject,
          as: 'subject'
          }]
        }, {
        model: CourseStudent,
        as: 'courseStudents',
        where: {
          studentId: studentId
        }
        }, {
        model: Class,
        as: 'class'
        }, {
        model: Term,
        as: 'term'
        }, {
        model: Major,
        as: 'major'
      }]

    })
      .success(function (courseStudent) {
        callback(null, courseStudent, false);
      })
      .error(function (error) {
        callback(error);
      });
  };

  model.findOneCourseStudent = function (courseId, callback) {

    // find the Course
    Course.find({
      include: [{
        model: SubjectVersion,
        as: 'subjectVersion',
        include: [{
          model: Subject,
          as: 'subject'
        }]
        }, {
        model: Class,
        as: 'class'
        }, {
        model: Term,
        as: 'term'
        }, {
        model: Major,
        as: 'major'
        }, {
        model: Schedule,
        as: 'schedules'
        }],
      where: {
        courseId: courseId
      }

    })
      .success(function (courseStudent) {
        callback(null, courseStudent, false);
      })
      .error(function (error) {
        callback(error);
      });
  };

});
