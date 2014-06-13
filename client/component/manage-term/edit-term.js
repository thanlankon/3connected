define.form('component.dialog.manage-term.EditTerm', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-term',
      action: 'edit'
    }
  };

  form.ServiceProxy = require('proxy.Term');

  form.formType = form.FormType.Dialog.EDIT;

  form.tmpl = 'dialog.manage-term.edit-term';

  form.validateRules = [{
    attribute: 'termName',
    rules: [{
      rule: 'required',
      message: 'term.name.required',
    }]
  }, {
    attribute: 'termId',
    rules: [{
      rule: 'required',
      message: 'term.id.required',
    }]
  }];

  form.initData = function () {
    // init form data
    var data = {
      termName: null
    };

    this.data.attr(data);
  };

  form.ready = function () {
    // init form components and bind events
  };

});
