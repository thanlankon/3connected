define('core.util.Util', function (module, require) {

  var Underscore = require('lib.Underscore');

  var Util = module.exports = {};

  Util.Collection = {
    each: Underscore.each,
    toArray: Underscore.toArray
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
    isFunction: Underscore.isFunction
  };

  Util.random = Underscore.random;

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
    }
  }

  Util.value = function (value) {
    return Util.Object.isFunction(value) ? value() : value;
  };

});
