define.form('component.form.view-logs.ListAttendanceHistory', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'history',
      action: 'attendance'
    }
  };

  form.ServiceProxy = require('proxy.AttendanceHistory');

  form.tmpl = 'form.view-logs.list-attendanceHistory';

  form.formType = form.FormType.Form.LIST;


  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('attendanceHistory.attendanceHistoryId'),
      dataField: 'attendanceHistoryId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 150,
    }, {
      text: Lang.get('attendanceHistory.oldValue'),
      dataField: 'oldValue',
    }, {
      text: Lang.get('attendanceHistory.newValue'),
      dataField: 'newValue',
    }, {
      text: Lang.get('attendanceHistory.time'),
      dataField: 'time',
    }, {
      text: Lang.get('attendanceHistory.attendanceId'),
      dataField: 'attendanceId',
    }, {
      text: Lang.get('attendanceHistory.staffId'),
      dataField: 'staffId',
    }, {
      text: Lang.get('attendanceHistory.studentCode'),
      dataField: 'studentCode',
    }, {
      text: Lang.get('attendanceHistory.date'),
      dataField: 'date',
    }, {
      text: Lang.get('attendanceHistory.slot'),
      dataField: 'slot',
    }, {
      text: Lang.get('attendanceHistory.courseName'),
      dataField: 'courseName',
    }, {
      text: Lang.get('attendanceHistory.termName'),
      dataField: 'termName',
    }, {
      text: Lang.get('attendanceHistory.majorName'),
      dataField: 'majorName',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});
