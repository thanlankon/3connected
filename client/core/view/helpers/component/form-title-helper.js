define('core.view.helpers.FormTitleHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');

  View.registerHelper('form.title', formTitleHelper);

  function formTitleHelper(options) {

    var lang = options.hash.lang;

    var html = [
      '<div class="form-title" style="display: none" data-lang="',
      lang,
      '"></div>"'
    ].join('');

    return View.safeString(html);

  }

});
