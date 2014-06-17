//ThanhVMSE90059
define.form('component.dialog.manage-department.EditDepartment', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-department',
      action: 'edit'
    }
  };

  form.ServiceProxy = require('proxy.Department');

  form.formType = form.FormType.Dialog.EDIT;

  form.tmpl = 'dialog.manage-department.edit-department';

  form.validateRules = [{
    attribute: 'departmentName',
    rules: [{
      rule: 'required',
      message: 'department.name.required',
    }]
  }, {
    attribute: 'departmentId',
    rules: [{
      rule: 'required',
      message: 'department.id.required',
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
