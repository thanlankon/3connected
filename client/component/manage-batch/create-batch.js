define.form('component.dialog.manage-batch.CreateBatch', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-batch/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-batch',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-batch.create-batch';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.Batch');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Batch');
});
