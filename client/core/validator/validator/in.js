define('core.validator.In', function (module, require) {

  module.exports = function (attribute, value, ruleData, rules, data) {

    // skip checking for null or undefined
    if (value === '' || value === null || value === undefined) return true;

    var items = ruleData.items || [];

    var isValid = (items.indexOf(value) !== -1);
    isValid = isValid || (!isNaN(+value) && (items.indexOf(+value) !== -1));

    return isValid;

  };

});
