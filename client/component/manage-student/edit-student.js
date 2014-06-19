define.form('component.dialog.manage-student.EditStudent', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-student/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-student',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-student.edit-student';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
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
