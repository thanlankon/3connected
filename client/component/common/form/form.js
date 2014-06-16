define.component('component.Form', function (component, require, Util, Lang) {

  var jQuery = require('lib.jQuery');
  var Route = require('core.route.Route');
  var MsgBox = require('component.common.MsgBox');

  //  component.singleton = true;

  component.showForm = function (data) {
    this.element.show();

    if (this.refreshData) {
      this.refreshData(data)
    }

    // for form list
    if (this.formType == this.FormType.Form.LIST) {
      this.refreshGrid();
    }
  };

  component.hideForm = function () {
    this.element.hide();
  };

  component.initView = function (view) {
    var formElement = jQuery('<div />').addClass('form').append(view);

    this.element.append(formElement);

    this.element = formElement;

    //    this.initProxy();

    this.initForm();

    // for form list
    if (this.formType == this.FormType.Form.LIST) {
      if (this.initGrid) {
        this.initGrid();
      }
    }

    this.on();
  };

  component.beforeInitView = function (element, options) {
    this.data.attr('form', this);
  };

  component.initForm = function () {};

  component.events['[data-component-role=edit-button] click'] = function (element, event) {
    event.preventDefault();

    if (element.hasClass('disabled')) {
      return;
    }

    var href = element.find('a').attr('href');

    if (href.substr(0, 2) == '#!') {
      href = href.substr(2);
    }

    var params = Route.deparam(href);
    params.id = element.data('entityId');

    Route.attr(params);
  };

  component.events['[data-component-role=delete-button] click'] = function (element, event) {
    event.preventDefault();

    if (element.hasClass('disabled')) {
      return;
    }

    var entityIds = element.data('entityIds');

    MsgBox.confirm(Lang.get('entity.destroy.confirm', {
      'totalItems': entityIds.length
    }), this.proxy(doDestroy));

    function doDestroy() {
      var data = {};
      data[this.ServiceProxy.entityId] = entityIds;

      this.ServiceProxy.destroy(data, this.proxy(destroyDone));
    }

    function destroyDone(serviceResponse) {
      this.refreshGrid();
    }
  };

  component.events['[data-component-role=export-button] click'] = function (element, event) {
    event.preventDefault();

    var GridExport = require('component.export.grid.GridExport');

    GridExport.exportToExcel(this.grid, this.exportConfig);
  }

  component.initGrid = function () {

    var GridComponent = require('component.common.Grid');

    var getGridConfig = this.getGridConfig();

    this.grid = new GridComponent(this.element.find('[data-component-role=grid]'), {
      ServiceProxy: this.ServiceProxy,
      grid: getGridConfig
    });

    // update grid columns chooser
    var columnsChooser = this.element.find('.toolbar [data-component-role=grid-columns-choooser]');

    if (columnsChooser.size()) {
      var gridColumnsChooser = columnsChooser.data('GridColumnsChooser');

      gridColumnsChooser.updateSelectedColumns(getGridConfig.columns);
    }

  };

  component.getGridConfig = function () {
    if (Util.Object.isFunction(this.gridConfig)) {
      gridConfig = this.gridConfig();

      this.gridConfig = gridConfig;
    }

    return this.gridConfig;
  };

  component.refreshGrid = function () {
    if (this.grid) {
      this.grid.refreshData();
    }
  }

});
