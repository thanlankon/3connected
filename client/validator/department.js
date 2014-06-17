//ThanhVMSE90059
define('validator.rule.Department', function (module, require) {

  var ruleDepartmentId = {
    // validate for departmentId
    attribute: 'departmentId',
    attributeName: 'department.departmentId',
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

  var ruleDepartmentName = {
    // validate for departmentName
    attribute: 'departmentName',
    attributeName: 'department.departmentName',
    rules: [
      {
        // departmentName is required
        rule: 'required'
      },
      {
        // departmentName maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var ruleCreateDepartment = [
    ruleDepartmentName
  ];

  var ruleUpdateDepartment = [
    ruleDepartmentId,
  ].concat(ruleCreateDepartment);

  var ruleDepartment = {
    create: ruleCreateDepartment,
    update: ruleUpdateDepartment
  };

  module.exports = ruleDepartment;

});
