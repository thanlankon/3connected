define('core.view.helpers.component.GridColumnsChooserHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');

  var GridColumnsChooser = require('component.common.GridColumnsChooser');

  View.registerHelper('component.gridColumnsChooser', gridColumnsChooserHelper);

  function gridColumnsChooserHelper(options) {

    var componentData = this;
    var componentAttributes = Util.Object.omit(options.hash, ['attribute']);

    return function (element) {
      new GridColumnsChooser(element, {
        componentData: componentData,
        componentAttributes: componentAttributes
      });
    }

  }

});
