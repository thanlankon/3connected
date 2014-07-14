define('core.view.helpers.PartialHelper', function (module, require) {

  var View = require('core.view.View');
  var Route = require('core.route.Route');

  var jQuery = require('lib.jQuery');

  View.registerHelper('partial', partialHelper);

  function partialHelper(options) {
    if (!options.hash.id) return;

    var tmplId = options.hash.id;

    var tmplUrl = 'resource/template/' + tmplId + '.mustache';

    return View.safeString(View.render(tmplUrl, options.context));
  }

});
