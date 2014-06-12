define('core.view.helpers.UrlHelper', function (module, require) {

  var View = require('core.view.View');
  var Route = require('core.route.Route');

  View.registerHelper('url', urlHelper);

  function urlHelper(options) {
    return Route.url(options.hash);
  }

});
