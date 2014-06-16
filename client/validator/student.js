define('validator.rule.Student', function (module, require) {

  var ruleStudentId = {
    // validate for studentId
    attribute: 'studentId',
    rules: [
      {
        // studentId is required
        rule: 'required',
        message: 'student.studentId.required',
      },
      {
        rule: 'positiveInteger',
        message: 'student.studentId.positiveInteger',
      }
     ]
  };

  var ruleStudentCode = {
    // validate for studentCode
    attribute: 'studentCode',
    rules: [
      {
        // studentCode is required
        rule: 'required',
        message: 'student.studentCode.required',
        },
      {
        // studentCode max len is 20
        rule: 'maxLength',
        ruleData: {
          maxLength: 20
        },
        message: 'student.studentCode.maxLength',
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
        rule: 'required',
        message: 'student.firstName.required',
      },
      {
        // firstName max length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        },
        message: 'student.firstName.maxLength',
      }
     ]
  };

  var ruleLastName = {
    // validate for lastName
    attribute: 'lastName',
    rules: [
      {
        // lastName is required
        rule: 'required',
        message: 'student.lastName.required',
      },
      {
        // firstName max length is 100
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        },
        message: 'student.lastName.maxLength',
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
