/*
 * System          : 3connected
 * Component       : Course studebt model
 * Creator         : UayLU
 * Created date    : 2014/06/20
 */
define.model('model.CourseStudent', function (model, ModelUtil, require) {

  var CourseStudent = require('model.entity.CourseStudent');

  model.Entity = CourseStudent;

  model.addStudents = function (courseId, studentIds, callback) {

    var courseStudents = [];

    for (var i = 0, len = studentIds.length; i < len; i++) {
      courseStudents.push({
        courseId: courseId,
        studentId: studentIds[i]
      });
    }

    CourseStudent.bulkCreate(courseStudents)
      .success(function () {
        callback(null);
      })
      .error(function (error) {
        callback(error);
      });

  };

  model.removeStudents = function (courseStudentIds, callback) {
    CourseStudent.destroy({
      courseStudentId: courseStudentIds
    })
      .success(function (affectedRows) {
        callback(null, affectedRows);
      })
      .error(function (error) {
        callback(error);
      });
  };

});
