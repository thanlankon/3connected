define('core.validator.Validator', function (module, require) {

  var Util = require('core.util.Util');
  var Lang = require('core.lang.Lang');

  module.exports = {
    validate: validate
  };

  function validate(data, rules) {
    for (var i = 0, len = rules.length; i < len; i++) {
      var rule = rules[i];

      var validate = validateAttribute(rule.attribute, rule.attributeName, data[rule.attribute], rule.rules, data);

      if (!validate.isValid) {
        return validate;
      }
    }

    return {
      isValid: true
    };
  }

  function validateAttribute(attribute, attributeName, value, rules, data) {
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
        validator = 'core.validator.Required';
      }
      // maxLength
      else if (rule.rule == 'maxLength') {
        validator = 'core.validator.MaxLength';
      }
      // integer
      else if (rule.rule == 'integer') {
        validator = 'core.validator.Integer';
      }
      // positiveInteger - integer > 0
      else if (rule.rule == 'positiveInteger') {
        validator = 'core.validator.PositiveInteger';
      }
      // equal
      else if (rule.rule == 'equal') {
        validator = 'core.validator.Equal';
      }
      // min
      else if (rule.rule == 'min') {
        validator = 'core.validator.Min';
      }
      // max
      else if (rule.rule == 'max') {
        validator = 'core.validator.Max';
      }
      // in
      else if (rule.rule == 'in') {
        validator = 'core.validator.In';
      }

      validator = require(validator);

      if (!validator(attribute, value, rule.ruleData, rules, data)) {
        validate.isValid = false;

        validate.message = rule.message || 'validate.' + rule.rule;

        validate.messageData = {
          attribute: attribute,
          attributeName: attributeName ? Lang.get(attributeName) : null,
          value: value,
          additionalData: rule.ruleData
        };

        Util.Object.extend(validate.messageData, rule.ruleData);

        break;
      }
    }

    return validate;
  }

});
