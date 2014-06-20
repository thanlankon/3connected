define.component('component.common.ScheduleGrid', function (component, require, Util, Lang, jQuery) {

  // grid students
  component.getGridColumns = function () {

    var DateTimeConstant = require('constant.DateTime');

    if (!this.gridColumns) {
      var gridColumns = [{
        text: Lang.get('schedule.date'),
        dataField: 'date',

        cellsFormat: DateTimeConstant.WidgetFormat.DATE,
        filterType: 'date',
        editable: false
      }];

      for (var i = 1; i <= 9; i++) {
        gridColumns.push({
          text: Lang.get('schedule.slot' + i),
          dataField: 'slot' + i,

          width: '100px',
          filterType: 'bool',
          columnType: 'checkbox',
          //          threeStateCheckbox: false
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

    var source = this.generateSource();

    this.element.jqxGrid({
      source: source,
      columns: this.getGridColumns(),

      pageable: false,
      sortable: true,
      filterable: true,
      showFilterRow: true,
      editable: true,
      selectionmode: 'singlecell',
      editmode: 'click',

      width: '100%',
      height: '100%'
    });

    this.refreshData();
    //    this.resizeGrid();
    //
    //    $(window).resize(this.proxy(function () {
    //      this.resizeGrid();
    //    }));
  };

  component.resizeGrid = function () {
    var parent = this.element.closest('.content');

    var size = {
      width: parent.width(),
      height: parent.height()
    };

    this.element.jqxGrid(size);
  };

  component.refreshData = function () {
    var source = this.generateSource();

    this.element.jqxGrid({
      source: source
    });
  }

  component.generateSource = function (startDate, endDate, data) {

    var sourceData = [];

    // generate data
    for (var i = 1; i <= 100; i++) {
      var item = {
        date: new Date()
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
