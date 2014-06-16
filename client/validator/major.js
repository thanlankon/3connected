define('validator.rule.Major', function (module, require) {

  var ruleMajorId = {
    // validate for majorId
    attribute: 'majorId',
    attributeName: 'major.majorId',
    rules: [
      {
        // majorId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleMajorName = {
    // validate for majorName
    attribute: 'majorName',
    attributeName: 'major.majorName',
    rules: [
      {
        // majorName is required
        rule: 'required'
      },
      {
        // majorName maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var ruleCreateMajor = [
    ruleMajorName
  ];

  var ruleUpdateMajor = [
    ruleMajorId,
  ].concat(ruleCreateMajor);

  var ruleMajor = {
    create: ruleCreateMajor,
    update: ruleUpdateMajor
  };

  module.exports = ruleMajor;

});
