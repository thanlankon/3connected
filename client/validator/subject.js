/*
 * System          : 3connected
 * Component       : Subject validator
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */

define('validator.rule.Subject', function (module, require) {

  var ruleSubjectId = {
    // validate for subjectId
    attribute: 'subjectId',
    attributeName: 'subject.subjectId',
    rules: [
      {
        // subjectId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleSubjectCode = {
    // validate for subjectName
    attribute: 'subjectCode',
    attributeName: 'subject.subjectCode',
    rules: [
      {
        // subjectName is required
        rule: 'required'
      },
      {
        // subjectName maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 6
        }
      }
    ]
  };


  var ruleSubjectName = {
    // validate for subjectName
    attribute: 'subjectName',
    attributeName: 'subject.subjectName',
    rules: [
      {
        // subjectName is required
        rule: 'required'
      },
      {
        // subjectName maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var ruleNumberOfCredits = {
    // validate for subjectId
    attribute: 'numberOfCredits',
    attributeName: 'subject.numberOfCredits',
    rules: [
      {
        // subjectId is required
        rule: 'required'
      },
      {
        // courseName is required
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleCreateSubject = [
    ruleSubjectCode,
    ruleSubjectName,
    ruleNumberOfCredits
  ];

  var ruleUpdateSubject = [
    ruleSubjectId,
  ].concat(ruleCreateSubject);

  var ruleSubject = {
    create: ruleCreateSubject,
    update: ruleUpdateSubject
  };

  module.exports = ruleSubject;
});
