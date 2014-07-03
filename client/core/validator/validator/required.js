define('core.validator.Required', function (module, require) {

  var Util = require('core.util.Util');

  module.exports = function (attribute, value, rule, rules, data) {

    var isValid = false;

    if (Util.Object.isNumber(value)) {
      isValid = true;
    } else if (Util.Object.isString(value)) {
      isValid = value.trim().length > 0;
    } else if (Util.Object.isArray(value)) {
      isValid = value.length > 0;
    } else {
      isValid = !!value;
    }

    return isValid;

  };

});
