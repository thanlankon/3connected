define.form('component.dialog.manage-class.CreateClass', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-class/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-class',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-class.create-class';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.Class');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Class');

  // init form data
  form.initData = function () {

    var componentSettings = {
      batchId: {
        ServiceProxy: require('proxy.Batch'),
        combobox: {
          valueMember: 'batchId',
          displayMember: 'batchName'
        }
      },
      majorId: {
        ServiceProxy: require('proxy.Major'),
        combobox: {
          valueMember: 'majorId',
          displayMember: 'majorName'
        }
      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);
  };

});
