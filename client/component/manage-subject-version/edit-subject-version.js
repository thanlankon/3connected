define.form('component.dialog.manage-subjectVersion.EditSubjectVersion', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-gradeCategory/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-subjectVersion',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-subjectVersion.edit-subjectVersion';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.SubjectVersion');

  // the validation rules used by form
  form.validateRules = require('validator.rule.SubjectVersion');

  // init form data
  form.initData = function () {

    var componentSettings = {
      subjectId: {
        ServiceProxy: require('proxy.Subject'),
        combobox: {
          valueMember: 'subjectId',
          displayMember: 'subjectName'
        }
      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);
  };

});
