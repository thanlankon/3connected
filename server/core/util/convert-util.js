define('core.util.ConvertUtil', function (module, require) {

  var Moment = require('lib.Moment');
  var DateTimeConstant = require('constant.DateTime');

  var Util = require('core.util.Util');

  var ConvertUtil = {};

  ConvertUtil.DateTime = {
    toMySqlDate: function (date) {
      return Moment(date, DateTimeConstant.Format.DATE).format(DateTimeConstant.MySqlFormat.DATE);
    },

    parseDateTime: function (date) {
      return Moment.utc(date, DateTimeConstant.Format.DATE_TIME).toDate();
    },
    formatDate: function (date) {
      return Moment.utc(date).format(DateTimeConstant.Format.DATE);
    },
    formatDateTime: function (date) {
      return Moment.utc(date).format(DateTimeConstant.Format.DATE_TIME);
    }
  };

  ConvertUtil.Gender = {
    toString: function (gender) {
      switch (gender) {
      case Gender.UNKNOWN:
        gender = Lang.get('gender.unknown');
        break;
      case Gender.MALE:
        gender = Lang.get('gender.male');
        break;
      case Gender.FEMALE:
        gender = Lang.get('gender.female');
        break;
      }

      return gender;
    },

    toGender: function (string) {

    },
  };

  module.exports = ConvertUtil;

});
