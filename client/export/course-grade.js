define('export.CourseGrade', function (module, require) {

  module.exports = {

    fileName: 'Course Grade',
    sheetName: 'Course Grade',

    columns: {
      _default: {
        width: 30
      },

      studentCode: {
        width: 20
      },
      firstName: {
        width: 20
      },
      lastName: {
        width: 30
      },
      averageGrade: {
        width: 20
      },
      gradeStatus: {
        width: 15
      }

    }

  };

});
