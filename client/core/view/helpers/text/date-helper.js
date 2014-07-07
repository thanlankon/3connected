define('core.view.helpers.text.DateTextHelper', function (module, require) {

  var View = require('core.view.View');
  var Util = require('core.util.Util');
  var ConvertUtil = require('core.util.ConvertUtil');

  View.registerHelper('text.date', dateTextHelper);

  function dateTextHelper(date) {
    date = Util.value(date);

    return View.safeString(date);
  }

});
