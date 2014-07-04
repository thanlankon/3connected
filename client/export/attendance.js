define('export.Attendance', function (module, require) {

  module.exports = {

    fileName: 'Attendance',
    sheetName: 'Attendance',

    columns: {

      studentCode: {
        width: 10
      },
      firstName: {
        width: 30
      },
      lastName: {
        width: 50
      },
      totalPresents: {
        width: 20
      },
      totalAbsents: {
        width: 20
      },
      totalUnattended: {
        width: 20
      }

    }

  };

});
