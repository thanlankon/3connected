define('core.validator.Equal', function (module, require) {

  module.exports = function (attribute, value, ruleData, rules, data) {

    // skip checking for null or undefined
    if (value === null || value === undefined) return true;

    var attribute = ruleData.attribute;
    attribute = data[attribute];

    return value === attribute;

  };

});
