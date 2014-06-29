define('constant.DateTime', function (module, require) {

  var DateTime = {
    // date time format follow Moment
    Format: {
      DATE: 'DD/MM/YYYY',
      DATE_TIME: 'DD/MM/YYYY HH:mm',
      DATE_TIME_FULL: 'DD/MM/YYYY HH:mm:ss',
    },

    MySqlFormat: {
      DATE: 'YYYY-MM-DD',
      DATE_TIME: 'YYYY-MM-DD HH:mm:ss'
    }
  };

  module.exports = DateTime;

});
