/*
 * System          : 3connected
 * Component       : Subject export configuration
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */
define('export.Subject', function (module, require) {

  module.exports = {

    fileName: 'Subject',
    sheetName: 'Subject',

    columns: {

      subjectId: {
        width: 10
      },
      subjectCode: {
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
