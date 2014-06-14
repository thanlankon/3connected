define('core.view.helpers.component.ComboboxHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');

  var ComboboxComponent = require('component.common.Combobox');

  View.registerHelper('component.combobox', comboboxComponentHelper);

  function comboboxComponentHelper(options) {

    var componentData = this;
    var dataAttribute = options.hash.attribute;
    var componentAttributes = Util.Object.omit(options.hash, ['attribute']);

    return function (element) {
      new ComboboxComponent(element, {
        componentData: componentData,
        dataAttribute: dataAttribute,
        componentAttributes: componentAttributes
      });
    }

  }

});
