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

  var ruleStaffCode = {
    // validate for firstName
    attribute: 'staffCode',
    attributeName: 'staff.staffCode',
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
        // departmentId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleStaffRole = {
    // validate for departmentId
    attribute: 'staffRole',
    attributeName: 'staff.staffRole',
    rules: [
      {
        // departmentId is required
        rule: 'required'
      }
     ]
  };

  var ruleGender = {
    // validate for departmentId
    attribute: 'gender',
    attributeName: 'staff.gender',
    rules: [
      {
        // departmentId is required
        rule: 'required'
      }
     ]
  };

  var rulePhoneNumber = {
    // validate for departmentId
    attribute: 'phoneNumber',
    attributeName: 'staff.phoneNumber',
    rules: [
      {
        rule: 'positiveInteger'
      },
      {
        // lastName max length is 100
        rule: 'maxLength',
        ruleData: {
          maxLength: 11
        }
      }
     ]
  };

  var ruleCreateStaff = [
    ruleStaffCode,
    ruleStaffRole,
    ruleFirstName,
    ruleLastName,
    ruleDepartmentId,
    ruleGender,
    rulePhoneNumber
  ];

  var ruleUpdateStaff = [
    ruleStaffId,
    ruleStaffCode,
    ruleFirstName,
    ruleLastName,
    ruleDepartmentId,
    ruleGender,
    rulePhoneNumber
  ];

  var ruleStaff = {
    create: ruleCreateStaff,
    update: ruleUpdateStaff
  };

  module.exports = ruleStaff;

});
