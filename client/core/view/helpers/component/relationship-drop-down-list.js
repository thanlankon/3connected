define('core.view.helpers.component.RelationshipDropDownListHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');
  var RelationshipDropDownListComponent = require('component.common.RelationshipDropDownList');

  View.registerHelper('component.relationshipDropDownList', relationshipDropDownListComponentHelper);

  function relationshipDropDownListComponentHelper(options) {

    var componentData = this;
    var dataAttribute = options.hash.attribute;
    var componentAttributes = Util.Object.omit(options.hash, ['attribute']);

    return function (element) {
      new RelationshipDropDownListComponent(element, {
        componentData: componentData,
        dataAttribute: dataAttribute,
        componentAttributes: componentAttributes
      });
    }

  }

});
