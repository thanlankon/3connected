define('validator.rule.Class', function (module, require) {

  var ruleClassId = {
    // validate for classId
    attribute: 'classId',
    attributeName: 'class.classId',
    rules: [
      {
        // classId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleClassName = {
    // validate for className
    attribute: 'className',
    attributeName: 'class.className',
    rules: [
      {
        // className is required
        rule: 'required'
      },
      {
        // className maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var ruleCreateClass = [
    ruleClassName
  ];

  var ruleUpdateClass = [
    ruleClassId,
  ].concat(ruleCreateClass);

  var ruleClass = {
    create: ruleCreateClass,
    update: ruleUpdateClass
  };

  module.exports = ruleClass;

});
