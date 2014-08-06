define('core.view.helpers.DialogSizeHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');

  View.registerHelper('dialog.size', dialogSizeHelper);

  function dialogSizeHelper(options) {

    var width = options.hash.width;
    var height = options.hash.height;

    var html = [
      '<div class="dialog-size" style="display: none" data-width="',
      width,
      '" data-height="',
      height,
      '"></div>"'
    ].join('');

    return View.safeString(html);
  }

});
