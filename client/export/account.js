define('export.Account', function (module, require) {

  module.exports = {

    fileName: 'Account',
    sheetName: 'Account',

    columns: {

      accountId: {
        width: 10
      },
      username: {
        width: 50
      },
      password: {
        width: 50
      },
      role: {
        width: 50
      },
      userInformationId: {
        width: 50
      },
      isActive: {
        width: 50
      },
      effectiveDate: {
        width: 50
      },
      expireDate: {
        width: 50
      }

    }

  };

});
