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
  var GradeCategory = require('model.entity.GradeCategory');
  var CourseStudent = require('model.entity.CourseStudent');
  var Entity = require('core.model.Entity');

  model.getCourseGrade = function (courseId, callback) {

    var queryChainer = Entity.queryChainer();

    queryChainer
      .add(Course.find({
        where: {
          courseId: courseId
        },
        include: [{
          model: CourseStudentModel,
          as: 'courseStudent',
          include: [{
            model: StudentModel,
            as: 'student'
          }]
        }, {
          model: SubjectVersionModel,
          as: 'subjectVersion',
          include: [{
            model: SubjectModel,
            as: 'subject'
          }, {
            model: GradeCategoryModel,
            as: 'gradeCategory'
          }]
        }, {
          model: GradeModel,
          as: 'grade'
          }]
      }));

    queryChainer.run()
      .success(function (results) {
        var course = results[0];

        if (schedule == null) {
          callback(null, null, true);

          return;
        }

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

        // grade attendances
        var grade = [];
        var courseGrades = course.grade;

        for (var i = 0, len = courseGrades.length; i < len; i++) {
          var grade = courseGrades[i];

          grade.push({
            gradeId: grade.gradeId,
            gradeCategoryId: grade.gradecategoryId,
            studentId: grade.studentId,
            value: grade.value
          });
        }

        var isLocked = checkIfGradeIsLocked(schedule.date, schedule.slot);

        var courseGradeData = {
          students: students,
          grade: grade,
          isLocked: isLocked
        };

        callback(null, courseGradeData, false);
      })
      .error(function (error) {
        callback(error);
      });

  };

  model.updateCourseGrade = function (courseId, gradeData, callback) {

    var grades = [];

    for (var i = 0, len = grade.length; i < len; i++) {
      var grades = {
        gradeId: gradeData[i].gradeId,
        courseId: courseId,
        studentId: attendanceData[i].studentId,
        gradeCategoryId: attendanceData[i].gradeCategoryId,
        value: attendanceData[i].value
      };

      grades.push(grade);
    }

    Entity.transaction(function (transaction) {

      var queryChainer = Entity.queryChainer();

      grades.forEach(function (grade) {
        if (grade.attendanceId) {
          queryChainer.add(Grade.update({
            value: grade.value
          }, {
            gradeId: grade.gradeId
          }, {
            transaction: transaction
          }));
        } else {
          queryChainer.add(Grade.create({
            courseId: courseId,
            studentId: attendanceData[i].studentId,
            gradeCategoryId: attendanceData[i].gradeCategoryId,
            value: attendanceData[i].value
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

  function checkIfGradeIsLocked(date, slot, skipCheckAfter, skipCheckBefore) {

    var isLocked = false;

    return isLocked;
  }

});
