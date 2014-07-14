define('core.view.helpers.LangHelper', function (module, require) {

  var View = require('core.view.View');
  var Lang = require('core.lang.Lang');

  View.registerHelper('lang', langHelper);

  function langHelper(id, options) {
    //    return unescape(text);

    var lang = Lang.get(id, options.hash);

    return View.safeString(lang);
  }

});
