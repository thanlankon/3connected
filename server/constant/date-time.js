define('constant.DateTime', function (module, require) {

  var DateTime = {
    // date time format follow Moment
    Format: {
      DATE: 'DD/MM/YYYY'
    },

    MySqlFormat: {
      DATE: 'YYYY-MM-DD'
    }
  };

  module.exports = DateTime;

});
