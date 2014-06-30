/*
 * System          : 3connected
 * Component       : Grade model
 * Creator         : UayLu
 * Created date    : 2014/06/23
 */

define.model('model.Grade', function (model, ModelUtil, require) {

  var Grade = require('model.entity.Grade');
  var Student = require('model.entity.Student');
  var Course = require('model.entity.Course');
  var SubjectVersion = require('model.entity.SubjectVersion');
  var Subject = require('model.entity.Subject');
  var GradeCategory = require('model.entity.GradeCategory');
  var CourseStudent = require('model.entity.CourseStudent');
  var Entity = require('core.model.Entity');
  var GradeHistory = require('model.entity.GradeHistory');

  model.getCourseGrade = function (courseId, callback) {

    var queryChainer = Entity.queryChainer();

    // find the Course
    Course.find({
      where: {
        courseId: courseId
      },
      include: [{
        model: CourseStudent,
        as: 'courseStudents',
        include: [{
          model: Student,
          as: 'student'
        }]
      }, {
        model: SubjectVersion,
        as: 'subjectVersion',
        include: [{
          model: Subject,
          as: 'subject'
        }, {
          model: GradeCategory,
          as: 'gradeCategories'
        }]
      }]
    })
      .success(function (course) {
        if (course == null) {
          callback(null, null, true);
          return;
        }

        // find student's grades of the course
        getGrade(course)
      })
      .error(function (error) {
        callback(error);
      });

    function getGrade(course) {
      var gradeCategories = course.subjectVersion.gradeCategories;
      var students = course.courseStudents;

      var gradeCategoryIds = [];
      for (var i = 0, len = gradeCategories.length; i < len; i++) {
        gradeCategoryIds.push(gradeCategories[i].gradeCategoryId);
      }

      var studentIds = [];
      for (var i = 0, len = students.length; i < len; i++) {
        studentIds.push(students[i].studentId);
      }

      Grade.findAll({
        where: {
          gradeCategoryId: gradeCategoryIds,
          studentId: studentIds,
          courseId: courseId
        }
      })
        .success(function (grades) {
          buildCourseGrade(course, grades);
        })
        .error(function (error) {
          callback(error);
        });

    }

    function buildCourseGrade(course, grades) {

      // course students
      var students = [];
      var courseStudents = course.courseStudents;

      for (var i = 0, len = courseStudents.length; i < len; i++) {
        var student = courseStudents[i].student;

        students.push({
          studentId: student.studentId,
          studentCode: student.studentCode,
          firstName: student.firstName,
          lastName: student.lastName
        });
      }

      // course grade categories
      var gradeCategories = [];
      var courseGradeCategories = course.subjectVersion.gradeCategories;

      for (var i = 0, len = courseGradeCategories.length; i < len; i++) {
        var gradeCategory = courseGradeCategories[i];

        gradeCategories.push({
          gradeCategoryId: gradeCategory.gradeCategoryId,
          gradeCategoryCode: gradeCategory.gradeCategoryCode,
          gradeCategoryName: gradeCategory.gradeCategoryName,
          weight: gradeCategory.weight
        });
      }

      var courseGrade = {
        gradeCategories: gradeCategories,
        students: students,
        grades: grades
      };

      callback(null, courseGrade, false);

    }

  };

  model.updateCourseGrade = function (courseId, gradeData, callback) {

    if (!gradeData || !gradeData.length) {
      callback(null);
      return;
    }

    var grades = [];

    for (var i = 0, len = gradeData.length; i < len; i++) {
      var grade = {
        gradeId: gradeData[i].gradeId,
        courseId: courseId,
        studentId: gradeData[i].studentId,
        value: gradeData[i].value,
        gradeCategoryId: gradeData[i].gradeCategoryId
      };

      grades.push(grade);
    }

    Entity.transaction(function (transaction) {

      var findOrCreateQueryChainer = Entity.queryChainer();

      grades.forEach(function (grade) {
        findOrCreateQueryChainer.add(Grade.findOrCreate({
          gradeId: grade.gradeId
        }, {
          gradeCategoryId: grade.gradeCategoryId,
          studentId: grade.studentId,
          courseId: grade.courseId,
          value: grade.value
        }));

      });

      findOrCreateQueryChainer
        .run()
        .success(function (results) {
          var updateAndLogHistoryQueryChainer = Entity.queryChainer();

          results.forEach(function (attendance, index) {
            var gradeData = grades[index];

            if (gradeData.gradeId) {
              // update grade status and log history
              // only if value has changed
              if (gradeData.value != grade.value) {
                var oldValue = grade.value;
                var newValue = gradeData.value;

                // update grade status
                updateAndLogHistoryQueryChainer.add(grade.updateAttributes({
                  value: newValue
                }, {
                  transaction: transaction
                }));

                // log history
                updateAndLogHistoryQueryChainer.add(GradeHistory.create({
                  gradeId: grade.gradeId,
                  lecturerId: null,
                  oldValue: oldValue,
                  newValue: newValue
                }, {
                  transaction: transaction
                }));
              }
            } else {
              var oldValue = null;
              var newValue = gradeData.value;

              // log history for created grade
              updateAndLogHistoryQueryChainer.add(GradeHistory.create({
                gradeId: null,
                lecturerId: null,
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

  function checkIfGradeIsLocked(date, slot, skipCheckAfter, skipCheckBefore) {

    var isLocked = false;

    return isLocked;
  }

});
