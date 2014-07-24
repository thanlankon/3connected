define('validator.rule.Parent', function (module, require) {

  var Gender = require('enum.Gender');

  var ruleStudentId = {
    // validate for studentId
    attribute: 'studentId',
    attributeName: 'student.studentId',
    rules: [
      {
        // studentId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleParentId = {
    // validate for studentId
    attribute: 'parentId',
    attributeName: 'parent.parentId',
    rules: [
      {
        // studentId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleFirstName = {
    // validate for firstName
    attribute: 'firstName',
    attributeName: 'parent.firstName',
    rules: [
      {
        // firstName is required
        rule: 'required'
      },
      {
        // firstName max length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
     ]
  };

  var ruleLastName = {
    // validate for lastName
    attribute: 'lastName',
    attributeName: 'parent.lastName',
    rules: [
      {
        // lastName is required
        rule: 'required'
      },
      {
        // lastName max length is 100
        rule: 'maxLength',
        ruleData: {
          maxLength: 100
        }
      }
     ]
  };

  var ruleRelationship = {
    // validate for lastName
    attribute: 'relationship',
    attributeName: 'parent.relationship',
    rules: [
      {
        // lastName is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleGender = {
    // validate for gender
    attribute: 'gender',
    attributeName: 'parent.gender',
    rules: [
      {
        // classId is required
        rule: 'required'
      },
      {
        rule: 'in',
        ruleData: {
          items: [Gender.UNKNOWN, Gender.MALE, Gender.FEMALE]
        }
      }
     ]
  };

  var rulePhoneNumber = {
    // validate for studentId
    attribute: 'phoneNumber',
    attributeName: 'parent.phoneNumber',
    rules: [
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleCreateParent = [
    ruleStudentId,
    ruleFirstName,
    ruleLastName,
    rulePhoneNumber,
    ruleRelationship
  ];

  var ruleUpdateParent = [
    ruleParentId,
  ].concat(ruleCreateParent);

  var ruleParent = {
    create: ruleCreateParent,
    update: ruleUpdateParent
  };

  module.exports = ruleParent;

});
