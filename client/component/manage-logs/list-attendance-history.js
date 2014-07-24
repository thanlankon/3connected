/*
 * System          : 3connected
 * Component       : List attendance history component
 * Creator         : UayLU
 * Created date    : 2014/07/1
 */
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

      width: 140,
    }, {
      text: Lang.get('attendanceHistory.oldValue'),
      dataField: 'oldValue',
      width: 100,
      columnType: 'attendance'
    }, {
      text: Lang.get('attendanceHistory.newValue'),
      dataField: 'newValue',
      width: 100,
      columnType: 'attendance'
    }, {
      text: Lang.get('attendanceHistory.time'),
      dataField: 'time',
      width: 150
    }, {
      text: Lang.get('attendanceHistory.attendanceId'),
      dataField: 'attendanceId',
      width: 100
    }, {
      text: Lang.get('staff.staffCode'),
      dataField: 'staffCode',
      width: 100
    }, {
      text: Lang.get('attendanceHistory.studentCode'),
      dataField: 'studentCode',
      width: 100
    }, {
      text: Lang.get('attendanceHistory.date'),
      dataField: 'date',
      width: 100
    }, {
      text: Lang.get('attendanceHistory.slot'),
      dataField: 'slot',
      width: 100
    }, {
      text: Lang.get('attendanceHistory.courseName'),
      dataField: 'courseName',
    }, {
      text: Lang.get('attendanceHistory.termName'),
      dataField: 'termName',
      width: 100
    }, {
      text: Lang.get('attendanceHistory.majorName'),
      dataField: 'majorName',
      width: 150
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});
