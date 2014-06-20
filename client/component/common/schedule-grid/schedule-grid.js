define.component('component.common.ScheduleGrid', function (component, require, Util, Lang, jQuery) {

  // grid students
  component.getGridColumns = function () {

    var DateTimeConstant = require('constant.DateTime');

    if (!this.gridColumns) {
      var gridColumns = [{
        text: Lang.get('schedule.date'),
        dataField: 'date',

        cellsFormat: DateTimeConstant.WidgetFormat.DAY_OF_WEEK,
        filterType: 'date',
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
      filterable: true,
      showFilterRow: true,
      editable: true,
      editmode: 'click',

      width: '100%',
      height: '100%',
      scrollbarSize: 12,
      scrollMode: 'logical'
    });


    this.element.on('cellClick', this.proxy(function (event) {
      if (!event || !event.args || event.args.datafield == 'date') return;

      var args = event.args;

      this.element.jqxGrid('setCellValue', args.rowindex, args.datafield, !args.value);
    }));

  };

  component.refreshData = function () {
    var source = this.generateSource();

    this.element.jqxGrid({
      source: source
    });
  }

  component.generateSource = function (startDate, endDate, data) {

    var sourceData = [];

    var Moment = require('lib.Moment');

    // generate data
    for (var i = 1; i <= 100; i++) {
      var item = {
        date: Moment().add('days', i)
      };

      for (var j = 1; j <= 9; j++) {
        item['slot' + j] = (j % 2 == 0);
      }

      sourceData.push(item);
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

});
