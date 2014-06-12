define('core.view.helpers.DialogSizeHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');

  View.registerHelper('dialog.size', dialogSizeHelper);

  function dialogSizeHelper(options) {

    var width = options.hash.width;
    var height = options.hash.height;

    return function (element) {
      element = jQuery(element);

      element.addClass('dialog-size').data({
        width: width,
        height: height
      });
    };

  }

});
