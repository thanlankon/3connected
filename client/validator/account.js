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

  var ruleCreateAccount = [
    ruleUsername
  ];

  var ruleUpdateAccount = [
    ruleAccountId,
  ].concat(ruleCreateAccount);

  var ruleAccount = {
    create: ruleCreateAccount,
    update: ruleUpdateAccount
  };

  module.exports = ruleAccount;

});
