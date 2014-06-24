define('core.util.Util', function (module, require) {

  var Underscore = require('lib.Underscore');

  var Util = module.exports = {};

  Util.Collection = {
    each: Underscore.each,
    toArray: Underscore.toArray,

    min: Underscore.min,
    max: Underscore.max
  };

  Util.Array = {
    rest: Underscore.rest
  };

  Util.Object = {
    extend: Underscore.extend,
    clone: Underscore.clone,
    pick: Underscore.pick,
    omit: Underscore.omit,

    keys: Underscore.keys,

    isNumber: Underscore.isNumber,
    isString: Underscore.isString,
    isArray: Underscore.isArray,
    isDate: Underscore.isDate,
    isFunction: Underscore.isFunction,
    isObject: Underscore.isObject,
    isEmpty: Underscore.isEmpty,

    isInteger: function (object) {
      // check for type is Number
      if (!Util.Object.isNumber(object)) return false;

      // check for integer
      var isInteger = !isNaN(object) && parseInt(Number(object)) === object;

      return isInteger;
    }
  };

  Util.String = {
    lowerOne: function (str, index) {
      if (index) {
        return str;
      } else {
        return str[0].toLowerCase() + str.substr(1);
      }
    },
    upperOne: function (str, index) {
      if (index) {
        return str;
      } else {
        return str[0].toUpperCase() + str.substr(1);
      }
    },
    lowerAll: function (str) {
      return str.toLowerCase();
    },
    upperAll: function (str) {
      return str.toUpperCase();
    },

    plural: function (str) {
      if (str.slice(-1).toLowerCase() === 'f') {
        return str.slice(0, -1) + 'ves';
      }
      if (str.slice(-2).toLowerCase() === 'fe') {
        return str.slice(0, -2) + 'ves';
      }
      if (str.slice(-2).toLowerCase() === 'ff') {
        return str.slice(0, -2) + 'ves';
      }
      if (str.slice(-1).toLowerCase() === 'o') {
        return str + 'es';
      }
      if (str.slice(-1).toLowerCase() === 'y') {
        return str.slice(0, -1) + 'ies';
      }
      if (str.slice(-1).toLowerCase() === 'z') {
        return str.slice(0, -1) + 'zes';
      }
      if (str.slice(-1).toLowerCase() === 'z') {
        return str + 'zes';
      }
      if (str.slice(-2).toLowerCase() === 'ch') {
        return str + 'es';
      }
      if (str.slice(-2).toLowerCase() === 'sh') {
        return str + 'es';
      }
      if (str.slice(-1).toLowerCase() === 's') {
        return str + 'es';
      }
      if (str.slice(-1).toLowerCase() === 'x') {
        return str + 'es';
      }

      return str + 's';
    }
  }

  Util.value = function (value) {
    return Util.Object.isFunction(value) ? value() : value;
  };

});
