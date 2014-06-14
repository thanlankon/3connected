define('core.view.helpers.component.InputHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');
  var InputComponent = require('component.common.Input');

  View.registerHelper('component.input', inputComponentHelper);

  function inputComponentHelper(options) {

    var componentData = this;
    var dataAttribute = options.hash.attribute;
    var componentAttributes = Util.Object.omit(options.hash, ['attribute']);

    return function (element) {
      new InputComponent(element, {
        componentData: componentData,
        dataAttribute: dataAttribute,
        componentAttributes: componentAttributes
      });
    }

  }

});
