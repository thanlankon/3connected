define.form('component.dialog.manage-newsCategory.NewsCategory', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-news-category/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-news-category',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-newsCategory.create-newsCategory';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.NewsCategory');

  // the validation rules used by form
  form.validateRules = require('validator.rule.NewsCategory');
});
