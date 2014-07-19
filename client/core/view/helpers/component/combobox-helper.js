define('core.view.helpers.component.ComboboxHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');

  var ComboboxComponent = require('component.common.Combobox');
  var MultipleSelectionComboboxComponent = require('component.common.MultipleSelectionCombobox');
  var LocalDataComboboxComponent = require('component.common.LocalDataCombobox');
  var InlineSelectionComboboxComponent = require('component.common.InlineSelectionCombobox');

  View.registerHelper('component.combobox', comboboxComponentHelper);

  function comboboxComponentHelper(options) {

    var componentData = this;
    var dataAttribute = options.hash.attribute;
    var componentAttributes = Util.Object.omit(options.hash, ['id', 'attribute', 'localData', 'multipleSelection', 'inlineSelection']);

    var localData = options.hash.localData;
    var multipleSelection = options.hash.multipleSelection;
    var inlineSelection = options.hash.inlineSelection;

    var Combobox;

    if (inlineSelection) {
      Combobox = InlineSelectionComboboxComponent;
    } else if (localData) {
      Combobox = multipleSelection ? null : LocalDataComboboxComponent;
    } else {
      Combobox = multipleSelection ? MultipleSelectionComboboxComponent : ComboboxComponent;
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
