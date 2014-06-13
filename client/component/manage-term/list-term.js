define.form('component.form.manage-term.TermBatch', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-term'
    }
  };

  form.proxyMap = {
    proxy: 'proxy.Term'
  };

  form.tmpl = 'form.manage-term.list-term';

  form.formType = form.FormType.FORM;

  form.refreshData = function () {
    if (this.gridTerms) {
      this.gridTerms.refreshData();
    }
  };

  form.ready = function () {

    var GridComponent = require('component.common.Grid');

    var source = {
      url: 'api/term/findAll',

      id: 'termId',

      dataFields: [{
          name: 'termId',
          type: 'number'
        },
        {
          name: 'termName',
          type: 'string'
      }]
    };

    var gridColumns = [{
        text: Lang.get('term.id'),
        dataField: 'termId',

        cellsAlign: 'right',
        filterType: 'textbox',

        width: 150,
      },
      {
        text: Lang.get('term.name'),
        dataField: 'termName',
    }];

    this.gridTerms = new GridComponent(this.element.find('#grid-terms'), {
      source: source,
      grid: {
        columns: gridColumns,
        multiSelection: true
      }
    });

  };

});
