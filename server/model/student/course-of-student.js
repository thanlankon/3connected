define.model('model.student.CourseOfStudent', function (model, ModelUtil, require) {

  var Entity = require('core.model.Entity');
  var Course = require('model.entity.Course');
  var Student = require('model.entity.Student');
  var Grade = require('model.entity.Grade');
  var SubjectVersion = require('model.entity.SubjectVersion');
  var GradeCategory = require('model.entity.GradeCategory');
  var CourseStudent = require('model.entity.CourseStudent');

  model.getCourseGrade = function (studentId, courseId, callback) {
    CourseStudent.find({
      where: {
        studentId: studentId,
        courseId: courseId
      }
    })
      .success(function (courseStudent) {
        if (courseStudent == null) {
          // the course of student is not found
          callback(null, null, true);
          return;
        }

        doFindCourseGrade(studentId, courseId, callback);
      })
      .error(function (error) {
        callback(error);
      });

    function doFindCourseGrade(studentId, courseId, callback) {
      var queryChainer = Entity.queryChainer();

      queryChainer
        .add(Course.find({
          where: {
            courseId: courseId
          },
          include: [{
            model: SubjectVersion,
            as: 'subjectVersion',
            include: [{
              model: GradeCategory,
              as: 'gradeCategories',
            }]
          }]
        }))
        .add(Grade.findAll({
          where: {
            courseId: courseId,
            studentId: studentId
          }
        }));

      queryChainer
        .run()
        .success(function (results) {
          var course = results[0];
          var grades = results[1];

          var courseGrades = [];

          var gradeCategories = course.subjectVersion.gradeCategories;

          var gradeMap = {};
          for (var i = 0, gradeLen = grades.length; i < gradeLen; i++) {
            var grade = grades[i];
            gradeMap[grade.gradeCategoryId] = grade.value;
          }

          for (var i = 0, gradeCategoryLen = gradeCategories.length; i < gradeCategoryLen; i++) {
            var gradeCategory = gradeCategories[i];

            var courseGrade = {};
            courseGrade.gradeCategoryCode = gradeCategory.gradeCategoryCode;
            courseGrade.gradeCategoryName = gradeCategory.gradeCategoryName;
            courseGrade.weight = gradeCategory.weight;
            courseGrade.value = gradeMap[gradeCategory.gradeCategoryId];
            if (courseGrade.value === undefined) courseGrade.value = null;

            courseGrades.push(courseGrade);
          }

          callback(null, courseGrades, false);
        })
        .error(function (error) {
          callback(error);
        });
    }
  };

});
