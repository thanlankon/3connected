/*
 * System          : 3connected
 * Component       : List major component
 * Creator         : UayLU
 * Created date    : 2014/06/14
 */
define.form('component.form.manage-major.ListMajor', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-major'
    }
  };

  form.ServiceProxy = require('proxy.Major');

  form.tmpl = 'form.manage-major.list-major';

  form.formType = form.FormType.Form.LIST;

  form.exportConfig = require('export.Major');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('major.majorId'),
      dataField: 'majorId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 150
    }, {
      text: Lang.get('major.majorName'),
      dataField: 'majorName',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});
