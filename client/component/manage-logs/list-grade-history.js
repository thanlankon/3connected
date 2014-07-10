define.form('component.form.view-logs.ListGradeHistory', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'history',
      action: 'grade'
    }
  };

  form.ServiceProxy = require('proxy.GradeHistory');

  form.tmpl = 'form.view-logs.list-gradeHistory';

  form.formType = form.FormType.Form.LIST;


  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('gradeHistory.gradeHistoryId'),
      dataField: 'gradeHistoryId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 140,
    }, {
      text: Lang.get('gradeHistory.oldValue'),
      dataField: 'oldValue',
      width: 100
    }, {
      text: Lang.get('gradeHistory.newValue'),
      dataField: 'newValue',
      width: 100
    }, {
      text: Lang.get('gradeHistory.time'),
      dataField: 'time',
      width: 150
    }, {
      text: Lang.get('gradeHistory.gradeId'),
      dataField: 'gradeId',
      width: 100
    }, {
      text: Lang.get('gradeHistory.staffId'),
      dataField: 'staffId',
      width: 100
    }, {
      text: Lang.get('gradeHistory.studentCode'),
      dataField: 'studentCode',
      width: 100
    }, {
      text: Lang.get('gradeHistory.courseName'),
      dataField: 'courseName'
    }, {
      text: Lang.get('gradeHistory.termName'),
      dataField: 'termName'
    }, {
      text: Lang.get('gradeHistory.majorName'),
      dataField: 'majorName'
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});
