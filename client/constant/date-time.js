define('constant.DateTime', function (module, require) {

  var DateTime = {
    // date time format follow Moment
    Format: {
      DATE: 'DD/MM/YYYY',
      DAY_OF_WEEK: 'DD/MM/YYYY (dddd)',
      EXPORT_DATE_TIME: '',
    },

    WidgetFormat: {
      DATE: 'dd/MM/yyyy',
      DAY_TIME: 'dd/MM/yyyy HH:mm',
      DAY_OF_WEEK: 'dd/MM/yyyy (dddd)'
    }
  };

  module.exports = DateTime;

});
