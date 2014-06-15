define.form('component.dialog.manage-major.EditMajor', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-major',
      action: 'edit'
    }
  };

  form.ServiceProxy = require('proxy.Major');

  form.formType = form.FormType.Dialog.EDIT;

  form.tmpl = 'dialog.manage-major.edit-major';

  form.validateRules = [{
    attribute: 'majorName',
    rules: [{
      rule: 'required',
      message: 'major.name.required',
    }]
  }, {
    attribute: 'majorId',
    rules: [{
      rule: 'required',
      message: 'major.id.required',
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
