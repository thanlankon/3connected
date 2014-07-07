define('export.student.CourseGrade', function (module, require) {

  module.exports = {

    fileName: 'Course Grade',
    sheetName: 'Course Grade',

    columns: {

      gradeCategoryName: {
        width: 30
      },
      weight: {
        width: 10
      },
      value: {
        width: 10
      }

    }

  };

});
