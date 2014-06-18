define.form('component.dialog.manage-student.CreateStudent', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-student/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-student',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-student.create-student';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.Student');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Student');

  // init form data
  form.initData = function () {

    var componentSettings = {
      classId: {
        ServiceProxy: require('proxy.Class'),
        combobox: {
          valueMember: 'classId',
          displayMember: 'className'
        }
      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);
  };

});
