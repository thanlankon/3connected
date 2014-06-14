define.form('component.dialog.manage-batch.EditBatch', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-batch',
      action: 'edit'
    }
  };

  form.ServiceProxy = require('proxy.Batch');

  form.formType = form.FormType.Dialog.EDIT;

  form.tmpl = 'dialog.manage-batch.edit-batch';

  form.validateRules = [{
    attribute: 'batchName',
    rules: [{
      rule: 'required',
      message: 'batch.name.required',
    }]
  }, {
    attribute: 'batchId',
    rules: [{
      rule: 'required',
      message: 'batch.id.required',
    }]
  }];

  form.initData = function () {
    // init form data
    var data = {
      batchName: null,
      originalBatchName: null
    };

    this.data.attr(data);
  };

  form.ready = function () {
    // init form components and bind events
  };

});
