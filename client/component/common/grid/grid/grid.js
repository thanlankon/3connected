define.component('component.common.Grid', function (component, require, Util, Lang, jQuery) {

  component.maximumPageItems = 10000;

  component.initComponent = function (element, options) {

    var DateTimeConstant = require('constant.DateTime');

    this.toolbar = {};

    this.lastSelectedRow = null;

    this.eventHandlers = options.events || {};

    var formElement = this.element.closest('.form');

    var dependsEntityFocusedElements = formElement.find('.toolbar [data-depends-entity=focused]');
    if (dependsEntityFocusedElements.size()) {
      this.toolbar.dependsEntityFocusedElements = dependsEntityFocusedElements;

      this.updateDependsEntityFocusedElements(null);
    }

    var dependsEntitySelectedElements = formElement.find('.toolbar [data-depends-entity=selected]');
    if (dependsEntitySelectedElements.size()) {
      this.toolbar.dependsEntitySelectedElements = dependsEntitySelectedElements;

      this.updateDependsEntitySelectedElements(null);
    }

    var ServiceProxy = options.ServiceProxy;

    var source = this.generateSource(ServiceProxy);

    var gridOptions = options.grid;

    // allow all columns to be hidden
    for (var i = 0, len = gridOptions.columns.length; i < len; i++) {
      var gridColumn = gridOptions.columns[i];

      gridColumn.hideable = true;
      gridColumn.resizable = true;

      if (gridColumn.cellsRenderer) {
        gridColumn.originalRenderer = gridColumn.cellsRenderer;
        gridColumn.cellsRenderer = this.proxy(defaultCellsRenderer(gridColumn.cellsRenderer));
      }

      // for date
      if (['dateOfBirth'].indexOf(gridColumn.dataField) != -1) {
        gridColumn.width = '100px';

        gridColumn.cellsFormat = DateTimeConstant.WidgetFormat.DATE;
      }

      // for datetime
      if (['createdTime'].indexOf(gridColumn.dataField) != -1) {
        gridColumn.width = '200px';

        gridColumn.cellsFormat = DateTimeConstant.WidgetFormat.DATE;
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
          if (columnProperties.hidden) return;

          var ConvertUtil = require('core.util.ConvertUtil');

          var genderText = ConvertUtil.Gender.toString(value);

          var elmHtml = jQuery(defaultHtml).text(genderText);
          var elmWrapper = jQuery('<div />');

          var genderHtml = elmWrapper.append(elmHtml).html();

          elmHtml.remove();
          elmWrapper.remove();

          return genderHtml;
        }
      }

      // for attendance
      if (gridColumn.columnType == 'attendance' || ['attendance'].indexOf(gridColumn.dataField) != -1) {
        gridColumn.width = '100px';

        gridColumn.filterType = 'list';

        gridColumn.createFilterWidget = function (column, columnElement, widget) {
          var source = [
            Lang.get('attendance.all'),
            Lang.get('attendance.present'),
            Lang.get('attendance.absent'),
            Lang.get('attendance.unattended')
          ];

          widget.jqxDropDownList({
            source: source,
            dropDownWidth: '90px'
          });
        };

        gridColumn.cellsRenderer = function (row, columnField, value, defaultHtml, columnProperties) {
          if (columnProperties.hidden) return;

          var ConvertUtil = require('core.util.ConvertUtil');

          var attendanceText = ConvertUtil.Attendance.toString(value);

          var elmHtml = jQuery(defaultHtml).text(attendanceText);
          var elmWrapper = jQuery('<div />');

          var attendanceHtml = elmWrapper.append(elmHtml).html();

          elmHtml.remove();
          elmWrapper.remove();

          return attendanceHtml;
        }
      }

      // for role
      if (['role'].indexOf(gridColumn.dataField) != -1) {
        gridColumn.width = '150px';

        gridColumn.filterType = 'list';

        gridColumn.createFilterWidget = function (column, columnElement, widget) {
          var source = [
            Lang.get('role.all'),
            Lang.get('role.educator'),
            Lang.get('role.examinator'),
            Lang.get('role.newsManager'),
            Lang.get('role.teacher'),
            Lang.get('role.student'),
            Lang.get('role.parent'),
          ];

          widget.jqxDropDownList({
            source: source,
            dropDownWidth: '140px'
          });
        };

        gridColumn.cellsRenderer = function (row, columnField, value, defaultHtml, columnProperties) {
          if (columnProperties.hidden) return;

          var ConvertUtil = require('core.util.ConvertUtil');

          var roleText = ConvertUtil.Role.toString(value);

          var elmHtml = jQuery(defaultHtml).text(roleText);
          var elmWrapper = jQuery('<div />');

          var roleHtml = elmWrapper.append(elmHtml).html();

          elmHtml.remove();
          elmWrapper.remove();

          return roleHtml;
        }
      }

      // for relationship
      if (['relationship'].indexOf(gridColumn.dataField) != -1) {
        gridColumn.width = '150px';

        gridColumn.filterType = 'list';

        gridColumn.createFilterWidget = function (column, columnElement, widget) {
          var source = [
            Lang.get('relationship.unknown'),
            Lang.get('relationship.other'),
            Lang.get('relationship.father'),
            Lang.get('relationship.mother'),
            Lang.get('relationship.grandFather'),
            Lang.get('relationship.grandMother'),
            Lang.get('relationship.godParent'),
          ];

          widget.jqxDropDownList({
            source: source,
            dropDownWidth: '140px'
          });
        };

        gridColumn.cellsRenderer = function (row, columnField, value, defaultHtml, columnProperties) {
          if (columnProperties.hidden) return;

          var ConvertUtil = require('core.util.ConvertUtil');

          var roleText = ConvertUtil.Relationship.toString(value);

          var elmHtml = jQuery(defaultHtml).text(roleText);
          var elmWrapper = jQuery('<div />');

          var relationshipHtml = elmWrapper.append(elmHtml).html();

          elmHtml.remove();
          elmWrapper.remove();

          return relationshipHtml;
        }
      }

    }

    this.gridColumns = gridOptions.columns;

    this.element.data('GridComponent', this);

    gridOptions = {
      // source
      //source: source,
      // paging
      pageable: options.grid.pageable !== false,
      // resizing
      columnsResize: true,
      // sorting
      sortable: options.grid.sortable !== false,
      // filtering
      filterable: options.grid.filterable !== false,
      showFilterRow: options.grid.filterable !== false,
      // selection
      selectionMode: options.grid.singleSelection ? 'singlerow' : 'checkbox',
      enableHover: false,
      // size
      width: '100%',
      height: '100%',
      scrollBarSize: 12,
      scrollMode: 'logical',
      // columns
      columns: gridOptions.columns,
      // resize
      //      columnsResize: true,
      // other
      showEmptyRow: false,
      // toolbar
      showStatusbar: false,
      // loading
      showdefaultloadelement: false,
      autoshowloadelement: false
    };

    if (options.grid.pageable !== false) {
      gridOptions.pageSize = options.grid.pageable !== false ? 50 : this.maximumPageItems;
      gridOptions.pagerMode = 'simple';
      gridOptions.virtualMode = true;
      gridOptions.renderGridRows = function (params) {
        return params.data;
      };
    }

    this.element.jqxGrid(gridOptions);

    this.element.on('initialized', this.proxy(function () {
      this.element.jqxGrid({
        source: source
      });
    }));

    this.element.on('rowClick rowclick', this.proxy(function (event) {
      var args = event.args;

      var row = this.element.jqxGrid('getrowdata', args.rowindex);

      var rowElement = $(args.originalEvent.target).closest('[role="row"]');

      if (this.lastSelectedRow) {
        this.lastSelectedRow.removeClass('selected');
      }

      rowElement.addClass('selected');
      this.lastSelectedRow = rowElement;

      var entityId = row[this.source.id];

      this.updateDependsEntityFocusedElements(entityId);

      if (this.eventHandlers.singleSelect) {
        this.eventHandlers.singleSelect(entityId, row);
      }
    }));

    this.element.on('rowSelect rowUnselect rowselect rowunselect', this.proxy(function (event) {
      var args = event.args;
      var rowIndexes = args.rowindex;

      if (!Util.Object.isArray(rowIndexes)) {
        rowIndexes = [rowIndexes];
      }

      if (rowIndexes.length == 0) {
        this.updateDependsEntitySelectedElements(null);
        return;
      }

      for (var i = 0, len = rowIndexes.length; i < len; i++) {
        var row = this.element.jqxGrid('getrowdata', rowIndexes[i]);

        if (!row) continue;

        var entityId = row[this.source.id];

        this.updateDependsEntitySelectedElements(entityId);
      }
    }));

    this.element.on('pageChanged', this.proxy(function (event) {
      this.clearSelection();
    }));

    this.gridInitialized = true;

    function defaultCellsRenderer(cellsRenderer) {
      return function (rowIndex, columnField, value, defaultHtml, columnProperties) {
        if (columnProperties.hidden) return;

        var rowData = this.element.jqxGrid('getrowdata', rowIndex);

        var text = cellsRenderer(rowData, columnField, value);

        var elmHtml = jQuery(defaultHtml).html(text);
        var elmWrapper = jQuery('<div />');

        var html = elmWrapper.append(elmHtml).html();

        elmHtml.remove();
        elmWrapper.remove();

        return html;
      };
    }

  };

  component.generateSource = function (ServiceProxy) {
    var source = {};
    this.source = source;

    // date type
    source.dataType = 'json';

    var proxy, proxyMethod, entityMap;

    // service url
    if (ServiceProxy.proxy && ServiceProxy.method) {
      proxyMethod = ServiceProxy.proxy[ServiceProxy.method];
      proxy = ServiceProxy.proxy;
      entityMap = ServiceProxy.entityMap ? proxy[ServiceProxy.entityMap] : proxy.EntityMap;
    } else {
      proxyMethod = ServiceProxy.findAll;
      proxy = ServiceProxy;
      entityMap = ServiceProxy.EntityMap;
    }

    source.url = proxyMethod.url;

    // http method
    source.type = proxyMethod.httpMethod;

    // root element
    source.root = 'data.items';

    // id attribute
    source.id = proxy.entityId;

    // data fields
    source.dataFields = entityMap;

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
      beforeLoadComplete: this.proxy(function (data, originalData) {
        if (this.eventHandlers.processData) {
          this.eventHandlers.processData(data, originalData);
        }

        var totalRecords;

        if (this.eventHandlers.getTotalRecords) {
          totalRecords = this.eventHandlers.getTotalRecords(originalData);
        } else {
          totalRecords = originalData.data.total;
        }

        dataAdapter.totalrecords = totalRecords;
      }),

      // custom data send to server
      formatData: this.proxy(function (originalData) {
        var data = {};

        if (this.element.jqxGrid('pageable')) {
          data.pageSize = originalData.pagesize;
          data.pageIndex = originalData.pagenum || 0;
        }

        if (originalData.sortdatafield) {
          data.sortField = originalData.sortdatafield;

          // check if dataField is mapped
          for (var j = 0, dataFieldLen = source.dataFields.length; j < dataFieldLen; j++) {
            if (source.dataFields[j].name == data.sortField && source.dataFields[j].map) {
              data.sortField = source.dataFields[j].map;
              break;
            }
          }

          data.sortOrder = originalData.sortorder || 'ASC';
        }

        if (originalData.filterscount) {
          data.filters = [];

          for (var i = 0, len = originalData.filterscount; i < len; i++) {
            var dataField = originalData['filterdatafield' + i];
            var dataValue = originalData['filtervalue' + i];

            var column = Util.Collection.findWhere(this.gridColumns, {
              dataField: dataField
            });

            var columnType = column ? column.columnType : null;

            if (columnType == 'gender' || ['gender'].indexOf(dataField) != -1) {
              var ConvertUtil = require('core.util.ConvertUtil');

              dataValue = ConvertUtil.Gender.toGender(dataValue);
            }

            if (columnType == 'attendance' || ['attendance'].indexOf(dataField) != -1) {
              var ConvertUtil = require('core.util.ConvertUtil');

              dataValue = ConvertUtil.Attendance.toAttendance(dataValue);
            }

            if (columnType == 'role' || ['role'].indexOf(dataField) != -1) {
              var ConvertUtil = require('core.util.ConvertUtil');

              dataValue = ConvertUtil.Role.toRole(dataValue);
            }

            if (columnType == 'relationship' || ['relationship'].indexOf(dataField) != -1) {
              var ConvertUtil = require('core.util.ConvertUtil');

              dataValue = ConvertUtil.Relationship.toRelationship(dataValue);
            }

            // check if dataField is mapped
            for (var j = 0, dataFieldLen = source.dataFields.length; j < dataFieldLen; j++) {
              if (source.dataFields[j].name == dataField && source.dataFields[j].map) {
                dataField = source.dataFields[j].map;
                break;
              }
            }

            data.filters.push({
              field: dataField,
              value: dataValue
            });
          }
        }

        if (this.params) {
          Util.Collection.each(this.params, function (value, key) {
            data[key] = value;
          });
        }

        if (this.filterConditions) {
          if (!data.filters) data.filters = [];

          Util.Collection.each(this.filterConditions, function (value, key) {
            data.filters.push({
              field: key,
              value: value
            });
          });
        }

        if (this.excludeConditions) {
          if (!data.excludeFilters) data.excludeFilters = [];

          Util.Collection.each(this.excludeConditions, function (value, key) {
            data.excludeFilters.push({
              field: key,
              value: value
            });
          });
        }

        return data;
      })

    });

    return dataAdapter
  };

  component.setServiceProxy = function (ServiceProxy) {
    var source = this.generateSource(ServiceProxy);

    // clear filter conditions when change ServiceProxy
    // this.filterConditions = {};
    // this.excludeConditions = {};

    this.element.jqxGrid({
      source: source
    });

    this.clearSelection();
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

    this.updateDependsEntityFocusedElements(null);
    this.updateDependsEntitySelectedElements(null);
  };

  component.updateDependsEntityFocusedElements = function (entityId) {
    var dependsEntityFocusedElements = this.toolbar.dependsEntityFocusedElements;

    if (!dependsEntityFocusedElements) return;

    dependsEntityFocusedElements.each(this.proxy(updateElements));

    function updateElements(index, element) {
      element = $(element);

      if (entityId === null) {
        element.data('entityId', '');

        element.addClass('disabled');
      } else {
        element.data('entityId', entityId);

        element.removeClass('disabled');
      }
    }
  };

  component.updateDependsEntitySelectedElements = function (entityId) {
    var dependsEntitySelectedElements = this.toolbar.dependsEntitySelectedElements;

    if (!dependsEntitySelectedElements) return;

    dependsEntitySelectedElements.each(this.proxy(updateElements));

    function updateElements(index, element) {
      element = $(element);

      if (entityId === null) {
        element.data('entityIds', []);

        element.addClass('disabled');
      } else {
        var entityIds = element.data('entityIds');

        var index = entityIds.indexOf(entityId);

        if (index == -1) {
          entityIds.push(entityId);
        } else {
          entityIds.splice(index, 1);
        }

        element.data('entityId', entityIds);

        if (entityIds.length) {
          element.removeClass('disabled');
        } else {
          element.addClass('disabled');
        }
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
      pageSize = this.maximumPageItems;
    }

    this.element.jqxGrid({
      pageSize: pageSize
    });
  };

  component.setParams = function (key, value) {
    if (!this.params) {
      this.params = {};
    }

    if (value === null) {
      this.params = Util.Object.omit(this.params, key);
    } else {
      this.params[key] = value;
    }

    this.refreshData();
  };

  component.setFilterConditions = function (key, value, skipRefresh) {
    if (!this.filterConditions) {
      this.filterConditions = {};
    }

    if (value === null) {
      this.filterConditions = Util.Object.omit(this.filterConditions, key);
    } else {
      this.filterConditions[key] = value;
    }

    if (!skipRefresh) this.refreshData();
  };

  component.setExcludeConditions = function (key, value, skipRefresh) {
    if (!this.excludeConditions) {
      this.excludeConditions = {};
    }

    this.excludeConditions[key] = value;

    if (!skipRefresh) this.refreshData();
  };

  component.getSelectedIds = function () {
    var selectedIndexes = this.element.jqxGrid('getSelectedRowIndexes');

    var selectedIds = [];

    var entityId = this.source.id;

    for (var i = 0, len = selectedIndexes.length; i < len; i++) {
      var rowData = this.element.jqxGrid('getRowData', selectedIndexes[i]);

      if (!rowData || !rowData[entityId]) continue;

      selectedIds.push(rowData[entityId]);
    }

    return selectedIds;
  };

  component.refreshSize = function () {
    this.element.jqxGrid({
      width: '0px',
      height: '0px'
    });
    this.element.jqxGrid({
      width: '100%',
      height: '100%'
    });
  };

});
