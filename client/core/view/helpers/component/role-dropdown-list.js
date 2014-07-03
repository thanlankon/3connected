define('core.view.helpers.component.RoleDropDownListHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');
  var RoleDropDownListComponent = require('component.common.RoleDropDownList');

  View.registerHelper('component.roleDropDownList', roleDropDownListComponentHelper);

  function roleDropDownListComponentHelper(options) {

    var componentData = this;
    var dataAttribute = options.hash.attribute;
    var componentAttributes = Util.Object.omit(options.hash, ['attribute']);

    return function (element) {
      new RoleDropDownListComponent(element, {
        componentData: componentData,
        dataAttribute: dataAttribute,
        componentAttributes: componentAttributes
      });
    }

  }

});
