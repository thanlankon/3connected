define.form('component.dialog.manage-parent.EditParent', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-gradeCategory/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-parent',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-parent.edit-parent';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.Parent');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Parent');

  // init form data
  form.initData = function () {};

});
