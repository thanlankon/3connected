/*
 * System          : 3connected
 * Component       : Class model
 * Creator         : UayLU
 * Created date    : 2014/06/15
 */
define.model('model.Class', function (model, ModelUtil, require) {

  var Class = require('model.entity.Class');
  var Student = require('model.entity.Student');

  model.Entity = Class;

  model.addStudents = function (classId, studentIds, callback) {

    Student.update({
      classId: classId
    }, {
      studentId: studentIds
    })
      .success(function (affectedRows) {
        callback(null, affectedRows);
      })
      .error(function (error) {
        callback(error);
      });
  };

  model.removeStudents = function (classId, studentIds, callback) {
    Student.update({
      classId: null
    }, {
      studentId: studentIds
    })
      .success(function (affectedRows) {
        callback(null, affectedRows);
      })
      .error(function (error) {
        callback(error);
      });
  };

});
