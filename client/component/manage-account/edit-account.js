/*
 * System          : 3connected
 * Component       : Edit account component
 * Creator         : ThanhVM
 */
define.form('component.dialog.manage-account.EditAccount', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-account/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-account',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-account.edit-account';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.Account');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Account');
});
