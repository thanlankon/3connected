define('export.Subject', function (module, require) {

  module.exports = {

    fileName: 'Subject',
    sheetName: 'Subject',

    columns: {

      subjectId: {
        width: 10
      },
      subjecCode: {
        width: 20
      },
      subjectName: {
        width: 50
      },
      numberOfCredits: {
        width: 10
      }

    }

  };

});
