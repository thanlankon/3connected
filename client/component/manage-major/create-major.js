define.form('component.dialog.manage-major.CreateMajor', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-major/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-major',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-major.create-major';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.Major');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Major');
});
