define.form('component.dialog.manage-major.CreateMajor', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-major',
      action: 'create'
    }
  };

  form.ServiceProxy = require('proxy.Major');

  form.formType = form.FormType.Dialog.CREATE;

  form.tmpl = 'dialog.manage-major.create-major';

  form.validateRules = [{
    attribute: 'majorName',
    rules: [{
      rule: 'required',
      message: 'major.name.required',
    }]
  }];

  form.initData = function () {
    // init form data

    var data = {
      majorName: null
    };

    this.data.attr(data);
  };

  form.ready = function () {
    // init form components and bind events
  };

});
