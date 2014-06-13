define.form('component.dialog.manage-batch.CreateBatch', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-batch',
      action: 'create'
    }
  };

  form.ServiceProxy = require('proxy.Batch');

  form.formType = form.FormType.Dialog.CREATE;

  form.tmpl = 'dialog.manage-batch.create-batch';

  form.validateRules = [{
    attribute: 'batchName',
    rules: [{
      rule: 'required',
      message: 'batch.name.required',
    }]
  }];

  form.initData = function () {
    // init form data
    var data = {
      batchName: null
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
