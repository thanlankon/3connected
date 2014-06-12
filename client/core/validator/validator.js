define('core.validator.Validator', function (module, require) {

  var Util = require('core.util.Util');

  module.exports = {
    validate: validate
  };

  function validate(data, rules) {
    for (var i = 0, len = rules.length; i < len; i++) {
      var rule = rules[i];

      var validate = validateAttribute(rule.attribute, data[rule.attribute], rule.rules, data);

      if (!validate.isValid) {
        return validate;
      }
    }

    return {
      isValid: true
    };
  }

  function validateAttribute(attribute, value, rules, data) {
    var validate = {
      isValid: true,
      attribute: attribute,
      message: null
    };

    for (var i = 0, len = rules.length; i < len; i++) {
      var rule = rules[i];

      var validator;

      // custom validator
      if (Util.Object.isFunction(rule.rule)) {
        validator = rule.rule;
      }
      // required
      else if (rule.rule == 'required') {
        validator = requiredValidator
      }

      if (!validator(attribute, value, data)) {
        validate.isValid = false;
        validate.message = rule.message;

        break;
      }
    }

    return validate;
  }

  function requiredValidator(attribute, value, data) {
    var isValid = false;

    if (Util.Object.isNumber(value)) {
      isValid = true;
    } else if (Util.Object.isString(value)) {
      isValid = value.trim().length > 0;
    } else {
      isValid = !!value;
    }

    return isValid;
  }

});
