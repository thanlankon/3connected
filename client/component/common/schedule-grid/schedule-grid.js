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
          var dayOfWeek = value.getDay();

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
        type: 'date'
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
      filterable: false,
      showFilterRow: false,
      editable: false,

      width: '100%',
      height: '100%',
      scrollbarSize: 12,
      scrollMode: 'logical'
    });

    this.element.on('cellClick', this.proxy(this.processDataChange));

  };

  component.refreshData = function (startDate, endDate, originalData) {

    var source = this.generateSource(startDate, endDate, originalData);

    this.element.jqxGrid({
      source: source
    });
  }

  component.generateSource = function (startDate, endDate, originalData) {

    // reset schedule data
    this.scheduleData = {};

    var sourceData = [];

    // generate source data
    if (startDate && endDate && startDate <= endDate) {

      var Moment = require('lib.Moment');

      startDate = Moment(startDate);
      endDate = Moment(endDate);

      while (startDate.valueOf() <= endDate.valueOf()) {
        var item = {
          date: new Date(startDate.valueOf())
        };

        for (var j = 1; j <= 9; j++) {
          item['slot' + j] = false;
        }

        sourceData.push(item);

        startDate = startDate.add('days', 1);
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

    var date = ConvertUtil.DateTime.formatDate(dateCell.value);
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
      added: [],
      removed: []
    };

    Util.Collection.each(this.scheduleData, function (slots, date) {
      Util.Collection.each(slots, function (status, slot) {

        // convert slot from name to slot number
        var slot = +slot.slice(-1);

        if (status == 'ADDED') {
          scheduleData.added.push({
            date: date,
            slot: slot
          });
        } else if (status == 'DELETED') {
          scheduleData.removed.push({
            date: date,
            slot: slot
          });
        }

      });
    });

    return scheduleData;

  };

});
