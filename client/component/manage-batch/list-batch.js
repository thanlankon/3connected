define.form('component.form.manage-batch.ListBatch', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-batch
  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-batch'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-batch.list-batch';

  // the form type is Dialog.LIST
  form.formType = form.FormType.Form.LIST;

  // the proxy that used by the form
  // proxy.findAll & proxy.destroy methods will be used
  form.ServiceProxy = require('proxy.Batch');

  // the config used for exporting grid data
  form.exportConfig = require('export.Batch');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('batch.batchId'),
      dataField: 'batchId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 150,
    }, {
      text: Lang.get('batch.batchName'),
      dataField: 'batchName',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});
