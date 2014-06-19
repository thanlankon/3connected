define('validator.rule.Student', function (module, require) {

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

  var ruleStudentCode = {
    // validate for studentCode
    attribute: 'studentCode',
    attributeName: 'student.studentCode',
    rules: [
      {
        // studentCode is required
        rule: 'required'
      },
      {
        // studentCode max len is 20
        rule: 'maxLength',
        ruleData: {
          maxLength: 20
        }
      }
     ]
  };

  var ruleFirstName = {
    // validate for firstName
    attribute: 'firstName',
    attributeName: 'student.firstName',
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
    attributeName: 'student.lastName',
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

  var ruleClassId = {
    // validate for classId
    attribute: 'classId',
    attributeName: 'student.classId',
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

  var ruleGender = {
    // validate for gender
    attribute: 'gender',
    attributeName: 'student.classId',
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

  var ruleCreateStudent = [
    ruleStudentCode,
    ruleFirstName,
    ruleLastName
  ];

  var ruleUpdateStudent = [
    ruleStudentId,
  ].concat(ruleCreateStudent);

  var ruleStudent = {
    create: ruleCreateStudent,
    update: ruleUpdateStudent
  };

  module.exports = ruleStudent;

});
