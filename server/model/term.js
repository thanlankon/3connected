/*
 * System          : 3connected
 * Component       : Term model
 * Creator         : ThanhVM
 * Modifier        : UayLU
 * Created date    : 2014/06/14
 */
define.model('model.Term', function (model, ModelUtil, require) {

  var Term = require('model.entity.Term');
  var Course = require('model.entity.Course');
  var CourseStudent = require('model.entity.CourseStudent');

  model.Entity = Term;

  model.getTermCourseStudent = function (termId, studentId, callback) {

    // find the Course
    Term.findAll({
      where: {
        termId: termId
      },
      include: [{
        model: Course,
        as: 'courses',
        include: [{
          model: CourseStudent,
          as: 'courseStudents',
          where: {
            studentId: studentId
          }
        }]
      }]
    })
      .success(function (terms) {
        if (terms == null) {
          callback(null, null, true);
          return;
        }
        callback(null, terms, false);
      })
      .error(function (error) {
        callback(error);
      });
  };

});
