define.component('component.common.AttendanceGrid', function (component, require, Util, Lang, jQuery) {

  // grid columns
  component.getGridColumns = function () {

    var DateTimeConstant = require('constant.DateTime');

    if (this.gridColumns) return this.gridColumns;

    var gridColumns = [{
      text: Lang.get('attendance.student.studentCode'),
      dataField: 'studentCode',

      width: '150px',

      filterType: 'textbox',
      editable: false,

      cellClassName: function (row, dataField, value, rowData) {
        //          return cellClass;
      }
    }, {
      text: Lang.get('attendance.student.firstName'),
      dataField: 'firstName',

      filterType: 'textbox',
      editable: false,
    }, {
      text: Lang.get('attendance.student.lastName'),
      dataField: 'lastName',

      filterType: 'textbox',
      editable: false,
    }, {
      text: Lang.get('attendance.present'),
      dataField: 'isPresent',

      width: '150px',

      filterType: 'bool',
      columnType: 'checkbox',
      editable: false,
    }, {
      text: Lang.get('attendance.absent'),
      dataField: 'isAbsent',

      width: '150px',

      filterType: 'bool',
      columnType: 'checkbox',
      editable: false,
    }, {
      text: Lang.get('attendance.totalPresents'),
      dataField: 'totalPresents',

      width: '150px',

      filterType: 'textbox',
      editable: false,
    }, {
      text: Lang.get('attendance.totalAbsents'),
      dataField: 'totalAbsents',

      width: '150px',

      filterType: 'textbox',
      editable: false,
    }, {
      text: Lang.get('attendance.totalUnattended'),
      dataField: 'totalUnattended',

      width: '150px',

      filterType: 'textbox',
      editable: false,
    }];

    this.gridColumns = gridColumns;

    return this.gridColumns;

  };

  component.getGridDataFields = function () {

    if (this.gridDataFields) return this.gridDataFields;

    var getGridDataFields = [{
      name: 'attendanceId',
      type: 'number'
    }, {
      name: 'studentId',
      type: 'number'
    }, {
      name: 'studentCode',
      type: 'string'
    }, {
      name: 'firstName',
      type: 'string'
    }, {
      name: 'lastName',
      type: 'string'
    }, {
      name: 'totalPresents',
      type: 'number'
    }, {
      name: 'totalAbsents',
      type: 'number'
    }, {
      name: 'totalUnattended',
      type: 'number'
    }, {
      name: 'isPresent',
      type: 'bool'
    }, {
      name: 'isAbsent',
      type: 'bool'
    }];

    this.gridDataFields = getGridDataFields;

    return this.gridDataFields;
  }

  component.initComponent = function (element, options) {
    var formElement = this.element.closest('.form');

    formElement.on('visible', this.proxy(this.initGrid));
  };

  component.initGrid = function () {

    // check for init grid only once
    if (this.isGridInitialized) {
      return;
    } else {
      this.isGridInitialized = true;
    }

    var source = this.generateSource();

    this.element.jqxGrid({
      source: source,
      columns: this.getGridColumns(),

      pageable: false,
      sortable: false,
      filterable: true,
      showFilterRow: true,
      editable: false,

      width: '100%',
      height: '100%',
      scrollbarSize: 12,
      scrollMode: 'logical'
    });

    this.element.jqxGrid('removesort');

    this.element.on('cellClick', this.proxy(this.processDataChange));

  };

  component.refreshData = function (attendanceData) {

    var source = this.generateSource(attendanceData);

    this.element.jqxGrid({
      source: source
    });

  };

  component.generateSource = function (attendanceData) {

    var Attendance = require('enum.Attendance');

    var sourceData = [];

    this.sourceData = sourceData;

    this.originalData = {};

    // generate attendance data
    if (attendanceData) {

      var isLocked = attendanceData.isLocked || [];
      var students = attendanceData.students || [];
      var attendanceStatistics = attendanceData.statistics;
      var attendances = attendanceData.attendances || [];
      var hasAnyAttendances = attendances.length > 0;

      var studentAttendances = {};
      for (var i = 0, len = attendances.length; i < len; i++) {
        var attendance = attendances[i];
        studentAttendances[attendance.studentId] = {
          attendanceId: attendance.attendanceId,
          status: attendance.status
        };
      }

      for (var i = 0, len = students.length; i < len; i++) {
        var student = students[i];

        var totalPresents = attendanceStatistics.studentAttendances[student.studentId].totalPresents;
        var totalAbsents = attendanceStatistics.studentAttendances[student.studentId].totalAbsents;
        var totalUnattended = attendanceStatistics.totalSlots - totalPresents - totalAbsents;

        var item = {
          studentId: student.studentId,
          studentCode: student.studentCode,
          firstName: student.firstName,
          lastName: student.lastName,

          totalPresents: totalPresents,
          totalAbsents: totalAbsents,
          totalUnattended: totalUnattended,

          attendanceId: null,
          isPresent: isLocked ? false : true,
          isAbsent: false,
        };

        if (hasAnyAttendances) {
          var attendance = studentAttendances[student.studentId];
          if (attendance) {
            item.attendanceId = attendance.attendanceId;

            switch (attendance.status) {
            case Attendance.PRESENT:
              item.isPresent = true;
              item.isAbsent = false;
              break;
            case Attendance.ABSENT:
              item.isPresent = false;
              item.isAbsent = true;
              break;
            default:
              item.isPresent = false;
              item.isAbsent = false;
              break;
            }
          } else {
            item.isPresent = false;
            item.isAbsent = false;
          }
        }

        this.originalData[item.studentId] = {
          isPresent: item.isPresent,
          isAbsent: item.isAbsent
        };

        sourceData.push(item);
      }

    }

    // build source
    var source = {
      dataType: 'local',
      localData: sourceData,
      dataFields: this.getGridDataFields()
    };

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    return dataAdapter;
  };

  component.setEditable = function (editable) {
    this.isGridEditable = editable;
  };

  component.processDataChange = function (event, isForced) {

    if (!this.isGridEditable || !event || !event.args) return;

    var args = event.args;

    console.log(args);

    var rowData = this.element.jqxGrid('getrowdata', args.rowindex);

    var isPresent, isAbsent, totalPresents, totalAbsents, totalUnattended;

    if (args.datafield == 'isPresent') {
      if (isForced && rowData.isPresent) {
        return;
      }

      if (rowData.isPresent) {
        isPresent = false;
        isAbsent = false;

        totalPresents = rowData.totalPresents - 1;
        totalAbsents = rowData.totalAbsents;
        totalUnattended = rowData.totalUnattended + 1;
      } else if (rowData.isAbsent) {
        isPresent = true;
        isAbsent = false;

        totalPresents = rowData.totalPresents + 1;
        totalAbsents = rowData.totalAbsents - 1;
        totalUnattended = rowData.totalUnattended;
      } else {
        isPresent = true;
        isAbsent = false;

        totalPresents = rowData.totalPresents + 1;
        totalAbsents = rowData.totalAbsents;
        totalUnattended = rowData.totalUnattended - 1;
      }
    } else if (args.datafield == 'isAbsent') {
      if (isForced && rowData.isAbsent) {
        return;
      }

      if (rowData.isAbsent) {
        isAbsent = false;
        isPresent = false;

        totalAbsents = rowData.totalAbsents - 1;
        totalPresents = rowData.totalPresents;
        totalUnattended = rowData.totalUnattended + 1;
      } else if (rowData.isPresent) {
        isAbsent = true;
        isPresent = false;

        totalAbsents = rowData.totalAbsents + 1;
        totalPresents = rowData.totalPresents - 1;
        totalUnattended = rowData.totalUnattended;
      } else {
        isAbsent = true;
        isPresent = false;

        totalAbsents = rowData.totalAbsents + 1;
        totalPresents = rowData.totalPresents;
        totalUnattended = rowData.totalUnattended - 1;
      }
    } else {
      return;
    }

    this.element.jqxGrid('setCellValue', args.rowindex, 'isPresent', isPresent);
    this.element.jqxGrid('setCellValue', args.rowindex, 'isAbsent', isAbsent);
    this.element.jqxGrid('setCellValue', args.rowindex, 'totalPresents', totalPresents);
    this.element.jqxGrid('setCellValue', args.rowindex, 'totalAbsents', totalAbsents);
    this.element.jqxGrid('setCellValue', args.rowindex, 'totalUnattended', totalUnattended);

  };

  component.getAttendanceData = function () {

    var Attendance = require('enum.Attendance');

    var attendanceData = [];

    var gridRows = this.element.jqxGrid('getdisplayrows');

    for (var i = 0, len = gridRows.length; i < len; i++) {
      var row = gridRows[i];
      var originalData = this.originalData[row.studentId];

      // skip empty row
      if (!row || !originalData) continue;

      // skip unchanged row
      if (row.isPresent == originalData.isPresent && row.isAbsent == originalData.isAbsent) continue;

      var item = {
        attendanceId: row.attendanceId,
        studentId: row.studentId
      };

      if (row.isPresent) {
        item.status = Attendance.PRESENT;
      } else if (row.isAbsent) {
        item.status = Attendance.ABSENT;
      } else {
        item.status = Attendance.UNATTENDED;
      }

      attendanceData.push(item);
    }

    return attendanceData;

  };

  component.presentAll = function () {
    var gridRows = this.element.jqxGrid('getdisplayrows');

    var event = {
      args: {
        datafield: 'isPresent',
        rowindex: null
      }
    };

    for (var i = 0, len = gridRows.length; i < len; i++) {
      var row = gridRows[i];

      if (!row) continue;

      event.args.rowindex = row.visibleindex;

      this.processDataChange(event, true);
    }

  }

  component.presentAll = function () {
    this.selectAllStatus('isPresent');
  };

  component.absentAll = function () {
    this.selectAllStatus('isAbsent');
  };

  component.selectAllStatus = function (field) {
    var gridRows = this.element.jqxGrid('getdisplayrows');

    var event = {
      args: {
        datafield: field,
        rowindex: null
      }
    };

    for (var i = 0, len = gridRows.length; i < len; i++) {
      var row = gridRows[i];

      if (!row) continue;

      event.args.rowindex = row.visibleindex;

      this.processDataChange(event, true);
    }

  };

});
