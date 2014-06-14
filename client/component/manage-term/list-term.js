define.form('component.form.manage-term.ListTerm', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-term'
    }
  };

  form.ServiceProxy = require('proxy.Term');

  form.tmpl = 'form.manage-term.list-term';

  form.formType = form.FormType.Form.LIST;

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('term.id'),
      dataField: 'termId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 150,
    }, {
      text: Lang.get('term.name'),
      dataField: 'termName',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});
