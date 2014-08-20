define('core.validator.In', function (module, require) {

  module.exports = function (attribute, value, ruleData, rules, data) {

    // skip checking for null or undefined
    if (value === '' || value === null || value === undefined) return true;

    var items = ruleData.items || [];

    return (items.indexOf(value) !== -1);

  };

});
