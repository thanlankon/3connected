define('export.Course', function (module, require) {

  module.exports = {

    fileName: 'Course',
    sheetName: 'Course',

    columns: {

      courseId: {
        width: 10
      },
      courseName: {
        width: 30
      },
      className: {
        width: 30
      },
      staffCode: {
        width: 20
      },
      termName: {
        width: 30
      },
      majorName: {
        width: 30
      },
      subjectName: {
        width: 30
      },
      description: {
        width: 30
      }

    }

  };

});
