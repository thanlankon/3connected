define('core.validator.PositiveInteger', function (module, require) {

  var Util = require('core.util.Util');

  module.exports = function (attribute, value, rule, rules, data) {

    // skip checking for null or undefined
    if (value === null || value === undefined) return true;

    return Util.Object.isInteger(value) && value > 0;

  };

});
