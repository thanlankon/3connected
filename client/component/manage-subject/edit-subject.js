/*
 * System          : 3connected
 * Component       : Edit subject component
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */
define.form('component.dialog.manage-subject.EditSubject', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-subject/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-subject',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-subject.edit-subject';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.Subject');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Subject');
});
