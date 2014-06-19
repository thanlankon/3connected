define.form('component.dialog.manage-staff.EditStaff', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-staff/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-staff',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-staff.edit-staff';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
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
