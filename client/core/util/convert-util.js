define('core.util.ConvertUtil', function (module, require) {

  var Moment = require('lib.Moment');
  var Gender = require('enum.Gender');
  var DateTimeConstant = require('constant.DateTime');
  var Lang = require('core.lang.Lang');

  var Util = require('core.util.Util');

  var ConvertUtil = {};

  ConvertUtil.Export = {
    getExportFileName: function (fileName) {
      return Moment().format('[' + fileName + '] - YYYY-MM-DD HH[h]mm[m]ss[s][.xlsx]');
    }
  };

  ConvertUtil.DateTime = {
    //    parseDate: function (date, format) {
    //      return Moment(date).format(format);
    //    },
    format: function (date, format) {
      return Moment(date).format(format);
    },
    formatDate: function (date) {
      return Moment(date).format(DateTimeConstant.Format.DATE);
    },
    formatCurrentDate: function (format) {
      return Moment().format(DateTimeConstant.Format.DATE);
    },

    parseDate: function (date) {
      return Moment(date, DateTimeConstant.Format.DATE).toDate();
    },

    isDate: function (date, format) {
      return Moment(date, format).isValid();
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
