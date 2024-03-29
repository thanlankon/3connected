define('core.util.ConvertUtil', function (module, require) {

  var Moment = require('lib.Moment');
  var DateTimeConstant = require('constant.DateTime');

  var Util = require('core.util.Util');

  var ConvertUtil = {};

  ConvertUtil.DateTime = {
    toMySqlDate: function (date) {
      return Moment(date, DateTimeConstant.Format.DATE).format(DateTimeConstant.MySqlFormat.DATE);
    },
    toMySqlDateTime: function (date) {
      return Moment.utc(date).format(DateTimeConstant.MySqlFormat.DATE_TIME);
    },

    parseDateTime: function (date) {
      return Moment.utc(date, DateTimeConstant.Format.DATE_TIME).toDate();
    },
    formatDate: function (date) {
      return Moment.utc(date).format(DateTimeConstant.Format.DATE);
    },
    formatDateTime: function (date) {
      return Moment.utc(date).format(DateTimeConstant.Format.DATE_TIME);
    },
    formatDateTimeFull: function (date) {
      return Moment.utc(date).format(DateTimeConstant.Format.DATE_TIME_FULL);
    }
  };

  ConvertUtil.Blob = {
    fromBase64: function (base64) {
      var buffer = new Buffer(base64, 'base64');

      return buffer;
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
