define.form('component.form.manage-batch.ListBatch', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-batch'
    }
  };

  form.proxyMap = {
    proxy: 'proxy.Batch'
  };

  form.tmpl = 'form.manage-batch.list-batch';

  form.formType = form.FormType.FORM;

  form.refreshData = function () {
    if (this.gridBatches) {
      this.gridBatches.refreshData();
    }
  };

  form.ready = function () {

    var GridComponent = require('component.common.Grid');

    var source = {
      url: 'api/batch/findAll',

      id: 'batchId',

      dataFields: [{
          name: 'batchId',
          type: 'number'
        },
        {
          name: 'batchName',
          type: 'string'
      }]
    };

    var gridColumns = [{
        text: Lang.get('batch.id'),
        dataField: 'batchId',

        cellsAlign: 'right',
        filterType: 'textbox',

        width: 150,
      },
      {
        text: Lang.get('batch.name'),
        dataField: 'batchName',
    }];

    this.gridBatches = new GridComponent(this.element.find('#grid-batches'), {
      source: source,
      grid: {
        columns: gridColumns,
        multiSelection: true
      }
    });

  };

});
