define.component('component.common.ScheduleGrid', function (component, require, Util, Lang, jQuery) {

  // grid students
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

          var dayOfWeek = ConvertUtil.DateTime.parseDayOfWeek(value).getDay();

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

          editable: true,
          width: '100px',
          filterType: 'bool',
          columnType: 'checkbox',
          align: 'center',
          threeStateCheckbox: false,
          cellClassName: function (row, dataField, value, rowData) {
            if (value === true) {
              return 'schedule-slot-selected';
            }
          }
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
          type: 'bool'
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

  component.refreshData = function (startDate, endDate, originalData) {

    if (originalData) {
      this.originalData = originalData;
    }

    var source = this.generateSource(startDate, endDate, this.originalData);

    this.element.jqxGrid({
      source: source
    });
  }

  component.generateSource = function (startDate, endDate, originalData) {

    var ConvertUtil = require('core.util.ConvertUtil');

    // reset schedule data
    this.scheduleData = {};

    originalData = originalData || [];

    for (var i = 0, len = originalData.length; i < len; i++) {
      var schedule = originalData[i];

      if (!this.scheduleData[schedule.date]) {
        this.scheduleData[schedule.date] = {};
      }

      this.scheduleData[schedule.date]['slot' + schedule.slot] = 'UNCHANGED';
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
          var selected = !!(this.scheduleData[startDate] && this.scheduleData[startDate]['slot' + j]);

          item['slot' + j] = selected;
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

      updaterow: function (rowid, rowdata, commit) {
        commit(true);
      }
    };

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    return dataAdapter;
  };

  component.setEditable = function (editable) {
    this.isGridEditable = editable;
  };

  component.processDataChange = function (event) {

    var ConvertUtil = require('core.util.ConvertUtil');

    if (!this.isGridEditable || !event || !event.args || event.args.datafield == 'date') return;

    var args = event.args;

    var dateCell = this.element.jqxGrid('getcell', args.rowindex, 'date');

    var date = dateCell.value;
    date = ConvertUtil.DateTime.convertDayOfWeekToDate(date);

    var slot = args.datafield;

    var value = args.value;

    if (value) {
      // current value is TRUE -> to be unchecked

      switch (this.scheduleData[date][slot]) {
      case 'ADDED':
        this.scheduleData[date][slot] = 'DEATCHED';
        break;
      case 'UNCHANGED':
        this.scheduleData[date][slot] = 'DELETED';
        break;
      }
    } else {
      // current value is FALSE -> to be checked

      if (!this.scheduleData[date]) {
        this.scheduleData[date] = {};
      }

      if (!this.scheduleData[date][slot]) {
        this.scheduleData[date][slot] = 'ADDED';
      } else {
        switch (this.scheduleData[date][slot]) {
        case 'DELETED':
          this.scheduleData[date][slot] = 'UNCHANGED';
          break;
        case 'DEATCHED':
          this.scheduleData[date][slot] = 'ADDED';
          break;
        }
      }
    }

    this.element.jqxGrid('setCellValue', args.rowindex, args.datafield, !args.value);

  };

  component.getScheduleData = function () {

    var scheduleData = {
      addedItems: [],
      removedItems: []
    };

    Util.Collection.each(this.scheduleData, function (slots, date) {
      Util.Collection.each(slots, function (status, slot) {

        // convert slot from name to slot number
        var slot = +slot.slice(-1);

        if (status == 'ADDED') {
          scheduleData.addedItems.push({
            date: date,
            slot: slot
          });
        } else if (status == 'DELETED') {
          scheduleData.removedItems.push({
            date: date,
            slot: slot
          });
        }

      });
    });

    return scheduleData;

  };

});
