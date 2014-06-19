define('core.view.helpers.component.GridPagerHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');

  var GridPager = require('component.common.GridPager');

  View.registerHelper('component.gridPager', gridPagerHelper);

  function gridPagerHelper(options) {

    var componentData = this;
    var componentAttributes = Util.Object.omit(options.hash, ['attribute']);

    return function (element) {
      new GridPager(element, {
        componentData: componentData,
        componentAttributes: componentAttributes
      });
    }

  }

});
