/*
 * System          : 3connected
 * Component       : Create parent component
 * Creator         : UayLU
 * Created date    : 2014/01/07
 */
define.form('component.dialog.manage-parent.Parent', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-gradeCategory/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-parent',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-parent.create-parent';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.Parent');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Parent');

  // init form data
  form.initData = function (params) {

    if (!params) return;

    var studentId = 0;
    if (params.studentId) {

      studentId = +params.studentId;

      var data = {
        studentId: studentId
      };

      this.data.attr(data);
    }
  };

});
