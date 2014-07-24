define('core.util.ConvertUtil', function (module, require) {

  var Moment = require('lib.Moment');
  var Gender = require('enum.Gender');
  var Role = require('enum.Role');
  var Relationship = require('enum.Relationship');
  var Attendance = require('enum.Attendance');
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
    },
    toTimezoneDate: function (date) {
      date = date.getTime() + date.getTimezoneOffset() - 60000;

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
      var gender;

      switch (string) {
      case Lang.get('gender.male'):
        gender = Gender.MALE;
        break;
      case Lang.get('gender.female'):
        gender = Gender.FEMALE;
        break;
      default:
        gender = Gender.UNKNOWN;
        break;
      }

      return gender;
    },
  };

  ConvertUtil.Attendance = {
    toString: function (attendance) {
      switch (attendance) {
      case Attendance.UNATTENDED:
        attendance = Lang.get('attendance.unattended');
        break;
      case Attendance.PRESENT:
        attendance = Lang.get('attendance.present');
        break;
      case Attendance.ABSENT:
        attendance = Lang.get('attendance.absent');
        break;
      }

      return attendance;
    },

    toAttendance: function (string) {
      var attendance;

      switch (string) {
      case Lang.get('attendance.present'):
        attendance = Attendance.PRESENT;
        break;
      case Lang.get('attendance.absent'):
        attendance = Attendance.ABSENT;
        break;
      default:
        attendance = Attendance.UNATTENDED;
        break;
      }

      return attendance;
    },
  };

  ConvertUtil.Role = {
    toString: function (role) {
      switch (role) {
      case Role.ADMINISTRATOR:
        gender = Lang.get('role.administrator');
        break;
      case Role.EDUCATOR:
        gender = Lang.get('role.educator');
        break;
      case Role.EXAMINATOR:
        gender = Lang.get('role.examinator');
        break;
      case Role.NEWS_MANAGER:
        gender = Lang.get('role.newsManager');
        break;
      case Role.STUDENT:
        gender = Lang.get('role.student');
        break;
      case Role.PARENT:
        gender = Lang.get('role.parent');
        break;
      }

      return gender;
    },

    toRole: function (string) {
      var role;

      switch (string) {
      case Lang.get('role.administrator'):
        role = Role.ADMINISTRATOR;
        break;
      case Lang.get('role.educator'):
        role = Role.EDUCATOR;
        break;
      case Lang.get('role.examinator'):
        role = Role.EXAMINATOR;
        break;
      case Lang.get('role.newsManager'):
        role = Role.NEWS_MANAGER;
        break;
      case Lang.get('role.student'):
        role = Role.STUDENT;
        break;
      case Lang.get('role.parent'):
        role = Role.PARENT;
        break;
      default:
        role = null
        break;
      }

      return role;
    },
  };

  ConvertUtil.Relationship = {
    toString: function (relationship) {
      switch (relationship) {
      case Relationship.UNKNOWN:
        relationship = Lang.get('relationship.unknown');
        break;
      case Relationship.OTHER:
        relationship = Lang.get('relationship.other');
        break;
      case Relationship.FATHER:
        relationship = Lang.get('relationship.father');
        break;
      case Relationship.MOTHER:
        relationship = Lang.get('relationship.mother');
        break;
      case Relationship.GRAND_FATHER:
        relationship = Lang.get('relationship.grandFather');
        break;
      case Relationship.GRAND_MOTHER:
        relationship = Lang.get('relationship.grandMother');
        break;
      case Relationship.GODPARENT:
        relationship = Lang.get('relationship.godParent');
        break;
      }

      return relationship;
    },

    toRelationship: function (string) {
      var relationship;

      switch (string) {
      case Lang.get('relationship.unknown'):
        relationship = Relationship.UNKNOWN;
        break;
      case Lang.get('relationship.other'):
        relationship = Relationship.OTHER;
        break;
      case Lang.get('relationship.father'):
        relationship = Relationship.FATHER;
        break;
      case Lang.get('relationship.mother'):
        relationship = Relationship.MOTHER;
        break;
      case Lang.get('relationship.grandFather'):
        relationship = Relationship.GRAND_FATHER;
        break;
      case Lang.get('relationship.grandMother'):
        relationship = Relationship.GRAND_MOTHER;
        break;
      case Lang.get('relationship.godParent'):
        relationship = Relationship.GODPARENT;
        break;
      }

      return gender;
    },
  };

  module.exports = ConvertUtil;

});
