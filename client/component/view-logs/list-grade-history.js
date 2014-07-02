define.form('component.form.view-logs.ListGradeHistory', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'view-logsGrade'
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

      width: 150,
    }, {
      text: Lang.get('gradeHistory.oldValue'),
      dataField: 'oldValue',
    }, {
      text: Lang.get('gradeHistory.newValue'),
      dataField: 'newValue',
    }, {
      text: Lang.get('gradeHistory.time'),
      dataField: 'time',
    }, {
      text: Lang.get('gradeHistory.gradeId'),
      dataField: 'gradeId',
    }, {
      text: Lang.get('gradeHistory.staffId'),
      dataField: 'staffId',
    }, {
      text: Lang.get('gradeHistory.courseId'),
      dataField: 'courseId',
    }, {
      text: Lang.get('gradeHistory.courseName'),
      dataField: 'courseName',
    }, {
      text: Lang.get('gradeHistory.termName'),
      dataField: 'termName',
    }, {
      text: Lang.get('gradeHistory.majorName'),
      dataField: 'majorName',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});
