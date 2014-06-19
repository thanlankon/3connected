define.form('component.dialog.manage-class.CreateClass', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-class',
      action: 'create'
    }
  };

  form.ServiceProxy = require('proxy.Class');

  form.formType = form.FormType.Dialog.CREATE;

  form.tmpl = 'dialog.manage-class.create-class';

  form.validateRules = [{
    attribute: 'className',
    rules: [{
      rule: 'required',
      message: 'class.name.required',
    }]
  }, {
    attribute: 'batchId',
    rules: [{
      rule: 'required',
      message: 'class.batch.required',
    }]
  }];

  form.initData = function () {
    // init form data

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
      className: null,
      batchId: null,
      majorId: null,

      componentSettings: componentSettings
    };

    this.data.attr(data);
  };

  form.ready = function () {
    // init form components and bind events
  };

});