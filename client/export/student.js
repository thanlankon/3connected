define('export.Student', function (module, require) {

  module.exports = {

    fileName: 'Student',
    sheetName: 'Student',

    columns: {

      studentId: {
        width: 15
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
      className: {
        width: 10
      },
      batchName: {
        width: 15
      },
      majorName: {
        width: 15
      },
      gender: {
        width: 10
      },
      dateOfBirth: {
        width: 20
      },
      phoneNumber: {
        width: 30
      },
      address: {
        width: 50
      },
      email: {
        width: 40
      }

    }

  };

});
