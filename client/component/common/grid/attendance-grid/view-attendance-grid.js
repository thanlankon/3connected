define.component('component.common.ViewAttendanceGrid', function (component, require, Util, Lang, jQuery) {

  // grid columns
  component.getGridColumns = function () {

    var DateTimeConstant = require('constant.DateTime');

    if (!this.gridColumns) {
      var gridColumns = [{
        text: Lang.get('schedule.date'),
        dataField: 'date',

        cellsFormat: DateTimeConstant.WidgetFormat.DAY_OF_WEEK,
        filterType: 'textbox',
        editable: false,
        cellClassName: function (row, dataField, value, rowData) {
          var ConvertUtil = require('core.util.ConvertUtil');

          // get dayOfWeek as UTC day
          var dayOfWeek = ConvertUtil.DateTime.parseDayOfWeek(value).getUTCDay();

          var cellClass = 'schedule-date';

          if (dayOfWeek === 6 || dayOfWeek == 0) {
            cellClass += ' schedule-weekend';
          }

          return cellClass;
        }
      }];

      for (var i = 1; i <= 9; i++) {
        gridColumns.push({
          text: Lang.get('schedule.slot' + i),
          dataField: 'slot' + i,

          editable: false,
          width: '100px',
          align: 'center',
          filterType: 'textbox'
        });
      }

      this.gridColumns = gridColumns;
    }

    return this.gridColumns;

  };

  component.getGridDataFields = function () {

    if (!this.gridDataFields) {
      var getGridDataFields = [{
        name: 'date',
        type: 'string'
      }];

      for (var i = 1; i <= 9; i++) {
        getGridDataFields.push({
          name: 'slot' + i,
          type: 'string'
        });
      }

      this.gridDataFields = getGridDataFields;
    }

    return this.gridDataFields;
  }

  component.initComponent = function (element, options) {
    var formElement = this.element.closest('.form');

    formElement.on('visible', this.proxy(this.initGrid));
  }

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

  component.refreshData = function (startDate, endDate, originalData, originalAttendaceStudentData) {

    if (originalData && originalAttendaceStudentData) {
      this.originalData = originalData;
      this.originalAttendaceStudentData = originalAttendaceStudentData;
    }



    var source = this.generateSource(startDate, endDate, this.originalData, this.originalAttendaceStudentData);

    this.element.jqxGrid({
      source: source
    });

  }

  component.generateSource = function (startDate, endDate, originalData, originalAttendaceStudentData) {

    var ConvertUtil = require('core.util.ConvertUtil');

    // reset schedule data
    this.scheduleAttendaceStudentData = {};
    this.scheduleData = {};

    originalData = originalData || [];
    originalAttendaceStudentData = originalAttendaceStudentData || [];

    for (var i = 0, len = originalData.length; i < len; i++) {
      var schedule = originalData[i];

      console.log('originalData' + i);
      console.log(originalData[i]);

      if (!this.scheduleData[schedule.date]) {
        this.scheduleData[schedule.date] = {};
      }
      this.scheduleData[schedule.date]['slot' + schedule.slot] = {};
      this.scheduleData[schedule.date]['slot' + schedule.slot]['index'] = i;
    }


    for (var i = 0, len = originalAttendaceStudentData.length; i < len; i++) {
      var scheduleAttendaceStudentData = originalAttendaceStudentData[i];

      console.log('originalDataAttendaceStudent ' + i);
      console.log(originalAttendaceStudentData[i]);

      if (!this.scheduleAttendaceStudentData[scheduleAttendaceStudentData.date]) {
        this.scheduleAttendaceStudentData[scheduleAttendaceStudentData.date] = {};
      }
      this.scheduleAttendaceStudentData[scheduleAttendaceStudentData.date]['slot' + scheduleAttendaceStudentData.slot] = {};
      this.scheduleAttendaceStudentData[scheduleAttendaceStudentData.date]['slot' + scheduleAttendaceStudentData.slot]['index'] = i;
    }



    var sourceData = [];

    // generate source data
    if (startDate && endDate && ConvertUtil.DateTime.compare(startDate, endDate) <= 0) {

      var Moment = require('lib.Moment');

      while (ConvertUtil.DateTime.compare(startDate, endDate) <= 0) {
        var dayOfWeek = ConvertUtil.DateTime.convertDateToDayOfWeek(startDate);

        var item = {
          date: dayOfWeek
        };

        for (var j = 1; j <= 9; j++) {
          var isAttendance = !!(this.scheduleAttendaceStudentData[startDate] && this.scheduleAttendaceStudentData[startDate]['slot' + j]);
          var isHaveSchedule = !!(this.scheduleData[startDate] && this.scheduleData[startDate]['slot' + j]);

          if (isAttendance) {
            if (originalAttendaceStudentData[this.scheduleAttendaceStudentData[startDate]['slot' + j]['index']].attendances[0].status == 1) {
              item['slot' + j] = 'Present';
            } else if (originalAttendaceStudentData[this.scheduleAttendaceStudentData[startDate]['slot' + j]['index']].attendances[0].status == 2) {
              item['slot' + j] = 'Absent';
            }
          } else if (isHaveSchedule) {
            item['slot' + j] = 'Not Yet';
          }

        }
        sourceData.push(item);

        startDate = ConvertUtil.DateTime.addDays(startDate, 1);
      }

    }

    // build source
    var source = {
      dataType: 'local',
      localData: sourceData,
      dataFields: this.getGridDataFields(),

    };

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    return dataAdapter;
  };

  component.setEditable = function (editable) {
    this.isGridEditable = editable;
  };

});
