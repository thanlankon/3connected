define('core.validator.Min', function (module, require) {

  module.exports = function (attribute, value, ruleData, rules, data) {

    // skip checking for null or undefined
    if (value === '' || value === null || value === undefined) return true;

    value = +value;

    return !isNaN(value) && value >= ruleData.min;

  };

});
