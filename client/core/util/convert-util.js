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
    format: function (date, format) {
      return Moment.utc(date).format(format);
    },
    formatDate: function (date) {
      return Moment.utc(date).format(DateTimeConstant.Format.DATE);
    },
    formatDayOfWeek: function (date) {
      return Moment.utc(date).format(DateTimeConstant.Format.DAY_OF_WEEK);
    },
    formatCurrentDate: function (format) {
      return Moment.utc().format(DateTimeConstant.Format.DATE);
    },

    convertDateToDayOfWeek: function (date) {
      return Moment.utc(date, DateTimeConstant.Format.DATE).format(DateTimeConstant.Format.DAY_OF_WEEK);
    },

    convertDayOfWeekToDate: function (date) {
      return Moment.utc(date, DateTimeConstant.Format.DAY_OF_WEEK).format(DateTimeConstant.Format.DATE);
    },

    parseDate: function (date) {
      return Moment.utc(date, DateTimeConstant.Format.DATE).toDate();
    },
    parseDayOfWeek: function (date) {
      return Moment.utc(date, DateTimeConstant.Format.DAY_OF_WEEK).toDate();
    },

    isDate: function (date, format) {
      return Moment.utc(date, format).isValid();
    },

    compare: function (date1, date2) {
      date1 = ConvertUtil.DateTime.parseDate(date1);
      date2 = ConvertUtil.DateTime.parseDate(date2);

      if (date1 == date2) return 0;

      return date1 > date2 ? 1 : -1;
    },

    addDays: function (date, days) {
      date = ConvertUtil.DateTime.parseDate(date);

      date = Moment(date).add('days', days);

      return ConvertUtil.DateTime.formatDate(date);
    },

    toUTCDate: function (date) {
      date = date.getTime() + date.getTimezoneOffset() * 60000;

      return new Date(date);
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
