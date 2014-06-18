define.form('component.form.manage-student.ListStudent', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-student'
    }
  };

  form.ServiceProxy = require('proxy.Student');

  form.tmpl = 'form.manage-student.list-student';

  form.formType = form.FormType.Form.LIST;

  form.exportConfig = require('export.Student');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
        text: Lang.get('student.studentId'),
        dataField: 'studentId',

        cellsAlign: 'right',
        filterType: 'textbox',

        width: '100px',
        hidden: false
      },
      {
        text: Lang.get('student.studentCode'),
        dataField: 'studentCode',

        width: '150px',
      },
      {
        text: Lang.get('student.firstName'),
        dataField: 'firstName',
      },
      {
        text: Lang.get('student.lastName'),
        dataField: 'lastName',
      },
      {
        text: Lang.get('student.className'),
        dataField: 'className',

        width: '100px',
      },
      {
        text: Lang.get('student.batchName'),
        dataField: 'batchName',

        width: '150px',
      },
      {
        text: Lang.get('student.majorName'),
        dataField: 'majorName',

        width: '150px',
      },
      {
        text: Lang.get('student.gender'),
        dataField: 'gender',
      },
      {
        text: Lang.get('student.dateOfBirth'),
        dataField: 'dateOfBirth',

        width: '130px'
      },
      {
        text: Lang.get('student.address'),
        dataField: 'address',

        width: '200px',
        hidden: true
      },
      {
        text: Lang.get('student.email'),
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
