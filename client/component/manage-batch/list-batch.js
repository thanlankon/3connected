define.form('component.form.manage-batch.ListBatch', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-batch'
    }
  };

  form.ServiceProxy = require('proxy.Batch');

  form.tmpl = 'form.manage-batch.list-batch';

  form.formType = form.FormType.Form.LIST;

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('batch.id'),
      dataField: 'batchId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 150,
    }, {
      text: Lang.get('batch.name'),
      dataField: 'batchName',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});
