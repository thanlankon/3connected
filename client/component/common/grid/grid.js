define.component('component.common.Grid', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    this.toolbar = {};

    this.lastSelectedRow = null;

    var formElement = this.element.closest('.form');

    var editButton = formElement.find('.toolbar [data-role=edit-button]');
    if (editButton.size()) {
      this.toolbar.editButton = editButton;

      this.updateEditButton(null);
    }

    var deleteButton = formElement.find('.toolbar [data-role=delete-button]');
    if (deleteButton.size()) {
      this.toolbar.deleteButton = deleteButton;

      this.updateDeleteButton(null);
    }

    var source = options.source;

    // date type
    source.dataType = 'json';

    // root element
    source.root = 'data>items';

    // auto update sort
    source.sort = this.proxy(function () {
      this.element.jqxGrid('updatebounddata', 'sort');

      this.clearSelection();
    });

    // auto update filter
    source.filter = this.proxy(function () {
      this.element.jqxGrid('updatebounddata', 'filter');
      this.clearSelection();
    });

    // data adapter
    var dataAdapter = new jQuery.jqx.dataAdapter(source, {

      // custom paging data
      beforeLoadComplete: function (data, originalData) {
        //        console.log(data.length);
        dataAdapter.totalrecords = originalData.data.total;
      },

      // custom data send to server
      formatData: this.proxy(function (originalData) {
        var data = {};

        if (this.element.jqxGrid('pageable')) {
          data.pageSize = originalData.pagesize;
          data.pageIndex = originalData.pagenum || 0;
        }

        if (originalData.sortdatafield) {
          data.sortField = originalData.sortdatafield;
          data.sortOrder = originalData.sortorder || 'ASC';
        }

        if (originalData.filterscount) {
          data.filters = [];

          for (var i = 0, len = originalData.filterscount; i < len; i++) {
            data.filters.push({
              field: originalData['filterdatafield' + i],
              value: originalData['filtervalue' + i],
            });
          }
        }

        return data;
      })

    });

    var gridOptions = options.grid;

    this.element.data('grid-component', this);

    this.element.jqxGrid({
      // source
      source: dataAdapter,
      // paging
      pageable: true,
      pageSize: 10,
      pagerMode: 'simple',
      virtualMode: true,
      renderGridRows: function (params) {
        return params.data;
      },
      // sorting
      sortable: true,
      // filtering
      filterable: true,
      showFilterRow: true,
      // selection
      selectionMode: options.grid.multiSelection ? 'checkbox' : 'singlerow',
      enableHover: false,
      // size
      width: '100%',
      height: '100%',
      scrollbarSize: 12,
      scrollMode: 'logical',
      // columns
      columns: gridOptions.columns,
      // other
      showEmptyRow: false,
      // toolbar
      showStatusbar: false
    });

    this.element.on('rowClick', this.proxy(function (event) {
      var args = event.args;

      var row = this.element.jqxGrid('getrowdata', args.rowindex);

      var rowElement = $(args.originalEvent.target).closest('[role="row"]');

      if (this.lastSelectedRow) {
        this.lastSelectedRow.removeClass('selected');
      }

      rowElement.addClass('selected');
      this.lastSelectedRow = rowElement;

      var entityId = row[source.id];

      this.updateEditButton(entityId);
    }));

    this.element.on('rowSelect rowUnselect', this.proxy(function (event) {
      var args = event.args;
      var rowIndexes = args.rowindex;

      if (!Util.Object.isArray(rowIndexes)) {
        rowIndexes = [rowIndexes];
      }

      if (rowIndexes.length == 0) {
        this.updateDeleteButton(null);
        return;
      }

      for (var i = 0, len = rowIndexes.length; i < len; i++) {
        var row = this.element.jqxGrid('getrowdata', rowIndexes[i]);

        if (!row) continue;

        var entityId = row[source.id];

        this.updateDeleteButton(entityId);
      }
    }));

    this.element.on('pageChanged', this.proxy(function (event) {
      this.clearSelection();
    }));

    this.gridInitialized = true;
  };

  component.refreshData = function () {
    this.element.jqxGrid('updatebounddata');
  };

  component.clearSelection = function () {
    this.element.jqxGrid('clearselection');

    if (this.lastSelectedRow) {
      this.lastSelectedRow.removeClass('selected');
    }

    this.updateEditButton(null);
    this.updateDeleteButton(null);
  };

  component.updateEditButton = function (entityId) {
    var editButton = this.toolbar.editButton;

    if (!editButton) return;

    if (entityId === null) {
      editButton.data('entityId', '');

      editButton.addClass('disabled');
    } else {
      editButton.data('entityId', entityId);

      editButton.removeClass('disabled');
    }
  };

  component.updateDeleteButton = function (entityId) {
    var deleteButton = this.toolbar.deleteButton;

    if (!deleteButton) return;

    if (entityId === null) {
      deleteButton.data('entityIds', []);

      deleteButton.addClass('disabled');
    } else {
      var entityIds = deleteButton.data('entityIds');

      var index = entityIds.indexOf(entityId);

      if (index == -1) {
        entityIds.push(entityId);
      } else {
        entityIds.splice(index, 1);
      }

      deleteButton.data('entityId', entityIds);

      if (entityIds.length) {
        deleteButton.removeClass('disabled');
      } else {
        deleteButton.addClass('disabled');
      }
    }
  };

});
