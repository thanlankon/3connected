define.form('component.dialog.manage-term.CreateTerm', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-term',
      action: 'create'
    }
  };

  form.proxyMap = {
    proxy: 'proxy.Term'
  };

  form.formType = form.FormType.Dialog.CREATE;

  form.tmpl = 'dialog.manage-term.create-term';

  form.validateRules = [{
    attribute: 'termName',
    rules: [{
      rule: 'required',
      message: 'term.name.required',
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

  //  form.refreshData = function () {
  //    // refresh data each time form is displayed
  //
  //    this.data.attr({
  //      batchName: null
  //    });
  //  }

});
