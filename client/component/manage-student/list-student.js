define.form('component.form.manage-student.ListStudent', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-student'
    }
  };

  //  form.ServiceProxy = require('proxy.Student');

  form.tmpl = 'form.manage-student.list-student';

  form.formType = form.FormType.Form.LIST;

  //  form.exportConfig = require('export.Student');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
        text: Lang.get('student.id'),
        dataField: 'studentId',

        cellsAlign: 'right',
        filterType: 'textbox',

        width: 150,
        hidden: false
      },
      {
        text: Lang.get('student.name'),
        dataField: 'studentName',
      },
      {
        text: Lang.get('batch.batchName'),
        dataField: 'batchName',
      },
      {
        text: Lang.get('major.name'),
        dataField: 'majorName',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});
