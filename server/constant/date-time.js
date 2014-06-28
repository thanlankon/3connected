define('constant.DateTime', function (module, require) {

  var DateTime = {
    // date time format follow Moment
    Format: {
      DATE: 'DD/MM/YYYY',
      DATE_TIME: 'DD/MM/YYYY HH:mm'
    },

    MySqlFormat: {
      DATE: 'YYYY-MM-DD'
    }
  };

  module.exports = DateTime;

});
