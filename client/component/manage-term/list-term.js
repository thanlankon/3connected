/*
 * System          : 3connected
 * Component       : List term component
 * Creator         : UayLU
 * Created date    : 2014/06/14
 */
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

  form.exportConfig = require('export.Term');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('term.termId'),
      dataField: 'termId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 150,
    }, {
      text: Lang.get('term.termName'),
      dataField: 'termName',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});
