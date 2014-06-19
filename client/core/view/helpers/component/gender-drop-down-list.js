define('core.view.helpers.component.GenderDropDownListHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');
  var GenderDropDownListComponent = require('component.common.GenderDropDownList');

  View.registerHelper('component.genderDropDownList', genderDropDownListComponentHelper);

  function genderDropDownListComponentHelper(options) {

    var componentData = this;
    var dataAttribute = options.hash.attribute;
    var componentAttributes = Util.Object.omit(options.hash, ['attribute']);

    return function (element) {
      new GenderDropDownListComponent(element, {
        componentData: componentData,
        dataAttribute: dataAttribute,
        componentAttributes: componentAttributes
      });
    }

  }

});
