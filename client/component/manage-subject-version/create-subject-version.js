/*
 * System          : 3connected
 * Component       : Create subject versions component
 * Creator         : ThanhVM
 * Created date    : 2014/16/06
 */
define.form('component.dialog.manage-subjectVersion.SubjectVersion', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-gradeCategory/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-subject-version',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-subjectVersion.create-subjectVersion';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.SubjectVersion');

  // the validation rules used by form
  form.validateRules = require('validator.rule.SubjectVersion');

  // init form data
  form.initData = function (params) {

    console.log(params.subjectId);

    var componentSettings = {
      subjectId: params.subjectId
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);
  };

});
