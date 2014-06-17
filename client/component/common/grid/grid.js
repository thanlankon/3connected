define.component('component.common.Grid', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    this.toolbar = {};

    this.lastSelectedRow = null;

    var formElement = this.element.closest('.form');

    var editButton = formElement.find('.toolbar [data-component-role=edit-button]');
    if (editButton.size()) {
      this.toolbar.editButton = editButton;

      this.updateEditButton(null);
    }

    var deleteButton = formElement.find('.toolbar [data-component-role=delete-button]');
    if (deleteButton.size()) {
      this.toolbar.deleteButton = deleteButton;

      this.updateDeleteButton(null);
    }

    var ServiceProxy = options.ServiceProxy;

    var source = {};

    // date type
    source.dataType = 'json';

    // service url
    source.url = ServiceProxy.findAll.url;

    // http method
    source.type = ServiceProxy.findAll.httpMethod;

    // root element
    source.root = 'data.items';

    // id attribute
    source.id = ServiceProxy.entityId;

    // data fields
    source.dataFields = ServiceProxy.EntityMap;

    // source mapping char
    source.mapChar = '.';
    source.mapchar = '.';

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
            var dataField = originalData['filterdatafield' + i];
            var dataValue = originalData['filtervalue' + i];

            if (['gender'].indexOf(dataField) != -1) {
              var Gender = require('enum.Gender');

              switch (dataValue) {
              case Lang.get('gender.unknown'):
                dataValue = Gender.UNKNOWN;
                break;
              case Lang.get('gender.male'):
                dataValue = Gender.MALE;
                break;
              case Lang.get('gender.female'):
                dataValue = Gender.FEMALE;
                break;
              }
            }

            data.filters.push({
              field: dataField,
              value: dataValue,
            });
          }
        }

        return data;
      })

    });

    var gridOptions = options.grid;

    // allow all columns to be hidden
    for (var i = 0, len = gridOptions.columns.length; i < len; i++) {
      var gridColumn = gridOptions.columns[i];

      gridColumn.hideable = true;
      gridColumn.resizable = true;

      // for datetime
      if (['dateOfBirth'].indexOf(gridColumn.dataField) != -1) {
        gridColumn.cellsFormat = 'dd/MM/yyyy';
      }

      // for gender
      if (['gender'].indexOf(gridColumn.dataField) != -1) {
        gridColumn.width = '100px';

        gridColumn.filterType = 'list';

        gridColumn.createFilterWidget = function (column, columnElement, widget) {
          var source = [
            Lang.get('gender.all'),
            Lang.get('gender.male'),
            Lang.get('gender.female'),
            Lang.get('gender.unknown')
          ];

          widget.jqxDropDownList({
            source: source,
            dropDownWidth: '90px'
          });
        };

        gridColumn.cellsRenderer = function (row, columnField, value, defaultHtml, columnProperties) {
          var Gender = require('enum.Gender');

          var genderText = null;

          switch (value) {
          case Gender.UNKNOWN:
            genderText = Lang.get('gender.unknown');
            break;
          case Gender.MALE:
            genderText = Lang.get('gender.male');
            break;
          case Gender.FEMALE:
            genderText = Lang.get('gender.female');
            break;
          }

          var elmHtml = jQuery(defaultHtml).text(genderText);
          var elmWrapper = jQuery('<div />');

          var genderHtml = elmWrapper.append(elmHtml).html();

          elmHtml.remove();
          elmWrapper.remove();

          return genderHtml;
        }
      }
    }

    this.gridColumns = gridOptions.columns;

    this.element.data('grid-component', this);

    this.element.jqxGrid({
      // source
      source: dataAdapter,
      // paging
      pageable: true,
      pageSize: 50,
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
      selectionMode: options.grid.singleSelection ? 'singlerow' : 'checkbox',
      enableHover: false,
      // size
      width: '100%',
      height: '100%',
      scrollbarSize: 12,
      scrollMode: 'logical',
      // columns
      columns: gridOptions.columns,
      // resize
      //      columnsResize: true,
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

    this.clearSelection();
  };

  component.clearSelection = function () {
    var selectedIndexes = this.element.jqxGrid('getselectedrowindexes');

    if (selectedIndexes.length) {
      this.element.jqxGrid('clearSelection');
    }

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

  component.hideColumn = function (column) {
    this.element.jqxGrid('hideColumn', column);
  };

  component.showColumn = function (column) {
    this.element.jqxGrid('showColumn', column);
  };

  component.setPageSize = function (pageSize) {
    pageSize = ~~pageSize;

    if (pageSize == 0) {
      pageSize = 10000;
    }

    this.element.jqxGrid({
      pageSize: pageSize
    });
  };

});
