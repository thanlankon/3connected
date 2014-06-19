define.form('component.dialog.manage-staff.CreateStaff', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-staff/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-staff',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-staff.create-staff';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.Staff');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Staff');

  // init form data
  form.initData = function () {

    var componentSettings = {
      departmentId: {
        ServiceProxy: require('proxy.Department'),
        combobox: {
          valueMember: 'departmentId',
          displayMember: 'departmentName'
        }
      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);
  };

});
