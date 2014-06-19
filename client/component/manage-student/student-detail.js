define.form('component.dialog.manage-student.StudentDetail', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-student/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-student',
      action: 'detail'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-student.student-detail';

  // the form type is Dialog.VIEW
  form.formType = form.FormType.Dialog.VIEW;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.Student');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Student');

});
