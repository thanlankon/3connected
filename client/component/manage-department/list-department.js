define.form('component.form.manage-department.ListDepartment', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-department'
    }
  };

  form.ServiceProxy = require('proxy.Department');

  form.tmpl = 'form.manage-department.list-department';

  form.formType = form.FormType.Form.LIST;

  form.exportConfig = require('export.Department');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('department.departmentId'),
      dataField: 'departmentId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 150
    }, {
      text: Lang.get('department.departmentName'),
      dataField: 'departmentName',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});
