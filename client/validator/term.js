define('validator.rule.Term', function (module, require) {

  var ruleTermId = {
    // validate for termId
    attribute: 'termId',
    attributeName: 'term.termId',
    rules: [
      {
        // termId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleTermName = {
    // validate for termName
    attribute: 'termName',
    attributeName: 'term.termName',
    rules: [
      {
        // termName is required
        rule: 'required'
      },
      {
        // termName maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var ruleCreateTerm = [
    ruleTermName
  ];

  var ruleUpdateTerm = [
    ruleTermId,
  ].concat(ruleCreateTerm);

  var ruleTerm = {
    create: ruleCreateTerm,
    update: ruleUpdateTerm
  };

  module.exports = ruleTerm;

});
