define('export.Staff', function (module, require) {

  module.exports = {

    fileName: 'Staff',
    sheetName: 'Staff',

    columns: {

      staffId: {
        width: 15
      },
      firstName: {
        width: 20
      },
      lastName: {
        width: 30
      },
      departmentName: {
        width: 10
      },
      gender: {
        width: 10
      },
      dateOfBirth: {
        width: 20
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
