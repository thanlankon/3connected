define('validator.rule.SubjectVersion', function (module, require) {

  var ruleSubjectVersionId = {
    // validate for grade category id
    attribute: 'subjectVersionId',
    attributeName: 'subjectVersion.subjectVersionId',
    rules: [
      {
        rule: 'required'
            },
      {
        rule: 'positiveInteger'
            }
        ]
  };

  var ruleSubjectId = {
    attribute: 'subjectId',
    attributeName: 'subject.subjectId',
    rules: [
      {
        rule: 'required'
            },
      {
        rule: 'positiveInteger'
            }
        ]
  };

  var ruleDescription = {
    // validate for grade category name
    attribute: 'description',
    attributeName: 'subjectVersion.description',
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

  var ruleCreateSubjectVersion = [
    ruleSubjectId,
    ruleDescription
  ];

  var ruleUpdateSubjectVersion = [
    ruleSubjectVersionId,
  ].concat(ruleCreateSubjectVersion);

  var ruleSubjectVersion = {
    create: ruleCreateSubjectVersion,
    update: ruleUpdateSubjectVersion
  };

  module.exports = ruleSubjectVersion;

});
