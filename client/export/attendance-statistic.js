define('export.AttendanceStatistic', function (module, require) {

  module.exports = {

    fileName: 'AttendanceStatistic',
    sheetName: 'AttendanceStatistic',

    columns: {

      studentId: {
        width: 10
      },
      firstName: {
        width: 30
      },
      lastName: {
        width: 30
      },
      totalAbsent: {
        width: 15
      },
      totalPresent: {
        width: 15
      },
      totalSlots: {
        width: 15
      },
      percentAbsent: {
        width: 17
      }


    }

  };

});
