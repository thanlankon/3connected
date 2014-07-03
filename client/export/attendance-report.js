define('export.AttendanceReport', function (module, require) {

  module.exports = {

    fileName: 'AttendanceReport',
    sheetName: 'AttendanceReport',

    columns: {

      studentCode: {
        width: 10
      },
      firstName: {
        width: 50
      },
      lastName: {
        width: 50
      },
      totalPresents: {
        width: 50
      },
      totalAbsents: {
        width: 50
      },
      totalUnattended: {
        width: 50
      }

    }

  };

});
