define.component('component.Form', function (component, require, Util, Lang) {

  var jQuery = require('lib.jQuery');
  var Route = require('core.route.Route');
  var MsgBox = require('component.common.MsgBox');

  component.singleton = true;

  component.showForm = function (data) {
    this.element.show();

    if (this.refreshData) {
      this.refreshData(data)
    }
  };

  component.hideForm = function () {
    this.element.hide();
  };

  component.initView = function (view) {
    var formElement = jQuery('<div />').addClass('form').append(view);

    this.element.append(formElement);

    this.element = formElement;

    this.initProxy();

    this.initForm();
  };

  component.initForm = function () {};

  component.events['[data-role=edit-button] click'] = function (element, event) {
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

  component.events['[data-role=delete-button] click'] = function (element, event) {
    event.preventDefault();

    if (element.hasClass('disabled')) {
      return;
    }

    var entityIds = element.data('entityIds');

    MsgBox.confirm(Lang.get('entity.delete.confirm', {
      'totalItems': entityIds.length
    }), this.proxy(doDestroy));

    function doDestroy() {
      var data = {};
      data[this.ServiceProxy.entityId] = entityIds;

      this.ServiceProxy.destroy(data, this.proxy(destroyDone));
    }

    function destroyDone(serviceResponse) {
      var grid = this.element.find('[data-role=grid]').data('grid-component');
      grid.refreshData();
      grid.clearSelection();
    }
  };


});
