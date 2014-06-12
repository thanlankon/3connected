define('model.Student', function (module, require) {

  var StudentModel = {};

  var Student = require('model.entity.Student');
  var Class = require('model.entity.Class');

  StudentModel.getAllStudents = function (options, callback) {

    var page = options.page;
    var sort = options.sort;

    var findOptions = {};

    if (page) {
      findOptions.limit = page.size;
      findOptions.offset = page.index * page.size;
    }

    if (sort) {
      findOptions.order = [
        [sort.field, sort.order]
      ];
    }

    //    findOptions.attributes = ['studentId', 'studentName'];
    findOptions.include = [{
      model: Class,
      as: 'class'
    }];

    console.log(findOptions);

    Student.findAndCountAll(findOptions)
      .success(function (students) {
        callback(null, students);
      })
      .error(function (error) {
        callback(error);
      });

  };

  StudentModel.createStudent = function (student, callback) {

    Student.create(student)
      .success(function (createdStudent) {
        callback(null, createdStudent);
      })
      .error(function (error) {
        callback(error);
      });

  };

  module.exports = StudentModel;

});
