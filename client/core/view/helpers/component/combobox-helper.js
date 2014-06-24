define('core.view.helpers.component.ComboboxHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');

  var ComboboxComponent = require('component.common.Combobox');
  var LocalDataComboboxComponent = require('component.common.LocalDataCombobox');

  View.registerHelper('component.combobox', comboboxComponentHelper);

  function comboboxComponentHelper(options) {

    var componentData = this;
    var dataAttribute = options.hash.attribute;
    var componentAttributes = Util.Object.omit(options.hash, ['attribute', 'localData', 'multipleSelection']);

    var localData = options.hash.localData;
    var multipleSelection = options.hash.multipleSelection;

    var Combobox
    if (localData) {
      Combobox = multipleSelection ? null : LocalDataComboboxComponent;
    } else {
      Combobox = multipleSelection ? null : ComboboxComponent;
    }

    return function (element) {
      new Combobox(element, {
        componentData: componentData,
        dataAttribute: dataAttribute,
        componentAttributes: componentAttributes
      });
    }

  }

});
