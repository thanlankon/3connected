define('validator.rule.Account', function (module, require) {

  var ruleAccountId = {
    // validate for accountId
    attribute: 'accountId',
    attributeName: 'account.accountId',
    rules: [
      {
        // accountId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleUsername = {
    // validate for username
    attribute: 'username',
    attributeName: 'account.username',
    rules: [
      {
        // username is required
        rule: 'required'
      },
      {
        // username maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var rulePassword = {
    // validate for username
    attribute: 'password',
    attributeName: 'account.password',
    rules: [
      {
        // username is required
        rule: 'required'
      },
      {
        // username maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var ruleConfirmPassword = {
    // validate for username
    attribute: 'confirmPassword',
    attributeName: 'account.confirmPassword',
    rules: [
      {
        // username is required
        rule: 'required'
      },
      {
        // username maximum length is 50
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

  var ruleCreateAccount = [
    ruleUsername,
  ];

  var ruleResetPassword = [
    ruleAccountId,
    rulePassword,
    ruleConfirmPassword
  ];

  var ruleUpdateAccount = [
    ruleAccountId,
  ].concat(ruleCreateAccount);

  var ruleAccount = {
    create: ruleCreateAccount,
    update: ruleUpdateAccount,
    resetPassword: ruleResetPassword
  };

  module.exports = ruleAccount;

});
