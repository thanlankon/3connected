define('constant.DateTime', function (module, require) {

  var DateTime = {
    // date time format follow Moment
    Format: {
      DATE: 'DD/MM/YYYY',
      EXPORT_DATE_TIME: '',
    },

    WidgetFormat: {
      DATE: 'dd/MM/yyyy'
    }
  };

  module.exports = DateTime;

});
