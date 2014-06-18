/*
 * System          : 3connected
 * Component       : Create subject component
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */
define.form('component.dialog.manage-subject.CreateSubject', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-subject/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-subject',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-subject.create-subject';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.Subject');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Subject');
});
