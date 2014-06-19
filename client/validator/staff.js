define('validator.rule.Staff', function (module, require) {

  var ruleStaffId = {
    // validate for staffId
    attribute: 'staffId',
    attributeName: 'staff.staffId',
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
    attributeName: 'staff.firstName',
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
    attributeName: 'staff.lastName',
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

  var ruleDepartmentId = {
    // validate for departmentId
    attribute: 'departmentId',
    attributeName: 'staff.departmentId',
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

  var ruleCreateStaff = [
    ruleFirstName,
    ruleLastName
  ];

  var ruleUpdateStaff = [
    ruleStaffId,
  ].concat(ruleCreateStaff);

  var ruleStaff = {
    create: ruleCreateStaff,
    update: ruleUpdateStaff
  };

  module.exports = ruleStaff;

});
