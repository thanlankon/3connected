define.form('component.form.manage-class.ListClass', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-class'
    }
  };

  form.ServiceProxy = require('proxy.Class');

  form.tmpl = 'form.manage-class.list-class';

  form.formType = form.FormType.Form.LIST;

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
        text: Lang.get('class.id'),
        dataField: 'classId',

        cellsAlign: 'right',
        filterType: 'textbox',

        width: 150,
      },
      {
        text: Lang.get('class.name'),
        dataField: 'className',
      },
      {
        text: Lang.get('batch.name'),
        dataField: 'batchName',
        width: 300,
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});
