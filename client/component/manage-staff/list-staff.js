define.form('component.form.manage-staff.ListStaff', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-staff'
    }
  };

  form.ServiceProxy = require('proxy.Staff');

  form.tmpl = 'form.manage-staff.list-staff';

  form.formType = form.FormType.Form.LIST;

  form.exportConfig = require('export.Staff');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
        text: Lang.get('staff.staffId'),
        dataField: 'staffId',

        cellsAlign: 'right',
        filterType: 'textbox',

        width: '100px',
        hidden: false
      },
      {
        text: Lang.get('staff.staffCode'),
        dataField: 'staffCode',
      },
      {
        text: Lang.get('staff.firstName'),
        dataField: 'firstName',
      },
      {
        text: Lang.get('staff.lastName'),
        dataField: 'lastName',
      },
      {
        text: Lang.get('staff.departmentName'),
        dataField: 'departmentName',

        width: '100px',
      },
      {
        text: Lang.get('staff.gender'),
        dataField: 'gender',
      },
      {
        text: Lang.get('staff.dateOfBirth'),
        dataField: 'dateOfBirth',

        width: '130px'
      },
      {
        text: Lang.get('staff.address'),
        dataField: 'address',

        width: '200px',
        hidden: true
      },
      {
        text: Lang.get('staff.email'),
        dataField: 'email',

        width: '200px',
        hidden: true
      }
    ];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});
