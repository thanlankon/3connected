define('core.validator.MaxLength', function (module, require) {

  module.exports = function (attribute, value, ruleData, rules, data) {

    // skip checking for null or undefined
    if (value === null || value === undefined) return true;

    value = '' + value;

    return value.length <= ruleData.maxLength;

  };

});
