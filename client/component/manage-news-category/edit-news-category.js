define.form('component.dialog.manage-newsCategory.EditNewsCategory', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-newsCategory/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-news-category',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-newsCategory.edit-newsCategory';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.NewsCategory');

  // the validation rules used by form
  form.validateRules = require('validator.rule.NewsCategory');
});
