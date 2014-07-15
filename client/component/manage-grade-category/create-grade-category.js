define.form('component.dialog.manage-gradeCategory.GradeCategory', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-gradeCategory/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-grade-category',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-gradeCategory.create-gradeCategory';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.GradeCategory');

  // the validation rules used by form
  form.validateRules = require('validator.rule.GradeCategory');

  // init form data
  form.initData = function (params) {

    if (!params) return;

    var subjectVersionId = 0;
    if (params.subjectVersionId) {

      subjectVersionId = +params.subjectVersionId;

      var data = {
        subjectVersionId: subjectVersionId
      };

      this.data.attr(data);
    }
  };

});
