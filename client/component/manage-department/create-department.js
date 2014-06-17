//ThanhVMSE90059
define.form('component.dialog.manage-department.CreateDepartment', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-department',
      action: 'create'
    }
  };

  form.ServiceProxy = require('proxy.Department');

  form.formType = form.FormType.Dialog.CREATE;

  form.tmpl = 'dialog.manage-department.create-department';

  form.validateRules = [{
    attribute: 'departmentName',
    rules: [{
      rule: 'required',
      message: 'department.name.required',
    }]
  }];

  form.initData = function () {
    // init form data
    var data = {
      departmentName: null
    };

    this.data.attr(data);
  };

  form.ready = function () {
    // init form components and bind events
  };

});
