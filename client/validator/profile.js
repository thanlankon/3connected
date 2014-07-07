define('validator.rule.Profile', function (module, require) {

  var ruleAccountId = {
    // validate for accountId
    attribute: 'accountId',
    attributeName: 'account.accountId',
    rules: [
      {
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleCurrentPassword = {
    // validate for currentPassword
    attribute: 'currentPassword',
    attributeName: 'account.currentPassword',
    rules: [
      {
        rule: 'required'
      },
      {
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var rulePassword = {
    // validate for password
    attribute: 'password',
    attributeName: 'account.password',
    rules: [
      {
        rule: 'required'
      },
      {
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var ruleConfirmPassword = {
    // validate for confirmPassword
    attribute: 'confirmPassword',
    attributeName: 'account.confirmPassword',
    rules: [
      {
        rule: 'required'
      },
      {
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      },
      {
        rule: 'equal',
        ruleData: {
          attribute: 'password'
        }
      }
    ]
  };

  var ruleChangePassword = [
    ruleAccountId,
    ruleCurrentPassword,
    rulePassword,
    ruleConfirmPassword
  ];

  var ruleProfile = {
    changePassword: ruleChangePassword
  };

  module.exports = ruleProfile;

});
