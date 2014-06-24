define.model('model.Attendance', function (model, ModelUtil, require) {

  //  var Attendance = require('model.entity.Attendance');
  var Student = require('model.entity.Student');
  var Course = require('model.entity.Course');
  var CourseStudent = require('model.entity.CourseStudent');
  var Entity = require('core.model.Entity');

  model.getCourseAttendance = function (courseId, callback) {

    var queryChainer = Entity.queryChainer();

    queryChainer
      .add(Course.find({
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
        }]
      }));

    queryChainer.run()
      .success(function (results) {
        var course = results[0];

        if (course == null) {
          callback(null, null, true);

          return;
        }

        var students = [];

        var courseStudents = course.courseStudents;
        for (var i = 0, len = courseStudents.length; i < len; i++) {
          var student = courseStudents[i].student;

          students.push({
            studentCode: student.studentCode,
            firstName: student.firstName,
            lastName: student.lastName
          });
        }

        var courseAttendance = {
          students: students
        };

        callback(null, courseAttendance, false);
      })
      .error(function (error) {
        callback(error);
      });

  };

});
