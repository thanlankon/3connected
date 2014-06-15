define.form('component.dialog.manage-class.EditClass', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-class',
      action: 'edit'
    }
  };

  form.ServiceProxy = require('proxy.Class');

  form.formType = form.FormType.Dialog.EDIT;

  form.tmpl = 'dialog.manage-class.edit-class';

  form.validateRules = [{
    attribute: 'className',
    rules: [{
      rule: 'required',
      message: 'class.name.required',
    }]
  }, {
    attribute: 'classId',
    rules: [{
      rule: 'required',
      message: 'class.id.required',
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
      classId: null,
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
