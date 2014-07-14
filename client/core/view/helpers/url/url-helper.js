define('core.view.helpers.UrlHelper', function (module, require) {

  var View = require('core.view.View');
  var Route = require('core.route.Route');
  var Util = require('core.util.Util');
  var jQuery = require('lib.jQuery');

  View.registerHelper('url', urlHelper);

  function urlHelper(options) {

    var urlData = options.hash;
    var element;

    Util.Collection.each(urlData, function (value, key) {
      if (Util.Object.isFunction(value)) {
        value.bind('change', updateUrl);
      }
    });

    function updateUrl() {
      if (!element) return;

      var routeData = {};

      Util.Collection.each(urlData, function (value, key) {
        if (Util.Object.isFunction(value)) {
          value = value();
        }

        routeData[key] = value;
      });

      var url = Route.url(routeData);

      element.attr('href', url);
    }

    return function (el) {
      element = jQuery(el);

      updateUrl();
    };
  }

});
