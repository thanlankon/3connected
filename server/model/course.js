/*
 * System          : 3connected
 * Component       : Course model
 * Creator         : VyBD
 * Modifier        : TrongND, UayLu
 * Created date    : 2014/06/17
 * Modified date   : 2014/06/23
 */

define.model('model.Course', function (model, ModelUtil, require) {

  var Entity = require('core.model.Entity');
  var Course = require('model.entity.Course');
  var Schedule = require('model.entity.Schedule');
  var Attendance = require('model.entity.Attendance');
  var SubjectVersion = require('model.entity.SubjectVersion');
  var Subject = require('model.entity.Subject');
  var Class = require('model.entity.Class');
  var Term = require('model.entity.Term');
  var Major = require('model.entity.Major');
  var CourseStudent = require('model.entity.CourseStudent');
  var Staff = require('model.entity.Staff');
  var Student = require('model.entity.Student');

  model.Entity = Course;

  model.create = function (entityData, checkStudentDuplicated, callback) {

    var courseData = entityData;

    Entity.transaction(function (transaction) {

      Course.findOrCreate(checkStudentDuplicated, courseData, {
        transaction: transaction
      })
        .success(function (createdCourse, created) {

          if (!created) {
            transaction.rollback();

            callback(null, createdCourse, true);
          } else {
            if (courseData.classId != null) {
              findClassStudent(courseData.classId, createdCourse, transaction);
            } else {
              transaction.commit();
              callback(null, createdCourse, false);
            }
          }
        })
        .error(function (error) {
          transaction.rollback();

          callback(error);
        });

    });

    function findClassStudent(classId, createdCourse, transaction) {
      Student.findAll({
        where: {
          classId: classId
        },
        order: 'studentId'

      })
        .success(function (classStudent) {
          if (classStudent.length) {
            var courseStudents = [];
            for (var i = 0, len = classStudent.length; i < len; i++) {
              courseStudents.push({
                courseId: createdCourse.courseId,
                studentId: classStudent[i].studentId
              });
            }
            createCourseStudent(courseStudents, createdCourse, transaction);
          } else {
            transaction.commit();
            callback(null, createdCourse, false);
          }
        })
        .error(function (error) {
          callback(error);
        });

    }

    function createCourseStudent(courseStudents, createdCourse, transaction) {

      CourseStudent.bulkCreate(courseStudents, {
        transaction: transaction
      })
        .success(function () {
          transaction.commit();
          callback(null, createdCourse, false);
        })
        .error(function (error) {
          transaction.rollback();
          callback(error, createdCourse, true);
        });
    }

  };

  model.update = function (entityData, checkDupplicatedData, checkExistanceData, callback) {

    var courseData = entityData;
    var modelEntity = Course;


    var courseId = checkExistanceData.courseId;

    Course.find({
      where: {
        courseId: courseId
      }
    })
      .success(function (course) {
        updateCourse(entityData, checkDupplicatedData, checkExistanceData, course);
      })
      .error(function (error) {
        callback(error);
      });

    function updateCourse(entityData, checkDupplicatedData, checkExistanceData, oldCourse) {
      Entity.transaction(function (transaction) {

        ModelUtil.update(modelEntity, entityData, checkDupplicatedData, checkExistanceData, function (error, updatedEntity, isDuplicated, isNotFound) {
          if (error || isDuplicated || isNotFound) {

            return;
            transaction.rollback();
            callback(error, updatedEntity, isDuplicated, isNotFound)
          }

          if (updatedEntity.classId == oldCourse.classId) {
            transaction.commit();
            callback(null, updatedEntity, false);
          } else {
            destroyOldCourseStudent(updatedEntity, transaction)
          }
        });

      });
    }

    function destroyOldCourseStudent(updatedEntity, transaction) {
      CourseStudent.destroy({
        courseId: updatedEntity.courseId
      }).success(function () {
        findClassStudent(updatedEntity, transaction);
        //        console.log('delete ok');
        //        transaction.commit();
        //        callback(null, updatedEntity, false);
      })
        .error(function (error) {
          transaction.rollback();
          callback(error);
        });

    }

    function findClassStudent(updatedEntity, transaction) {
      Student.findAll({
        where: {
          classId: updatedEntity.classId
        },
        order: 'studentId'

      })
        .success(function (classStudent) {
          if (classStudent.length) {
            var courseStudents = [];
            for (var i = 0, len = classStudent.length; i < len; i++) {
              courseStudents.push({
                courseId: updatedEntity.courseId,
                studentId: classStudent[i].studentId
              });
            }
            createCourseStudent(courseStudents, updatedEntity, transaction);
          } else {
            transaction.commit();
            callback(null, updatedEntity, false);
          }
        })
        .error(function (error) {
          callback(error);
        });

    }

    function createCourseStudent(courseStudents, updatedEntity, transaction) {

      CourseStudent.bulkCreate(courseStudents, {
        transaction: transaction
      })
        .success(function () {
          transaction.commit();
          callback(null, updatedEntity, false);
        })
        .error(function (error) {
          transaction.rollback();
          callback(error, updatedEntity, true);
        });
    }

  };


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

  model.findCourseStudent = function (studentId, findOptions, callback) {

    findOptions.filters = findOptions.filters || [];

    findOptions.filters.push({
      field: 'studentId',
      value: studentId,
      findExact: true
    });

    var includeOptions = [{
      model: Course,
      as: 'course',
      include: [{
        model: Class,
        as: 'class'
      }, {
        model: Term,
        as: 'term'
      }, {
        model: Major,
        as: 'major'
      }, {
        model: SubjectVersion,
        as: 'subjectVersion',
        include: [{
          model: Subject,
          as: 'subject'
        }]
      }]
    }];

    findOptions = ModelUtil.buildFindOptions(CourseStudent, findOptions);
    findOptions.include = includeOptions;

    // find the Course
    CourseStudent.findAndCountAll(findOptions)
      .success(function (courseStudent) {
        var findResult = {
          items: courseStudent.rows,
          total: courseStudent.count
        };

        callback(null, findResult, false);
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
        model: Staff,
        as: 'staff'
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
