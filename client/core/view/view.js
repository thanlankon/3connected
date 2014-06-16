define('core.view.View', function (module, require) {

  var Can = require('lib.Can');
  var Util = require('core.util.Util');

  var helpers = {};

  var View = {};

  View.make = function () {
    arguments[0] += '.mustache';

    return Can.view.apply(this, arguments);
  };

  View.registerHelper = function (name, helper) {
    Can.Mustache.registerHelper(name, helper);
  };

  View.safeString = Can.Mustache.safeString;

  View.render = function (idOrUrl, data) {

    return Can.view.render(idOrUrl, data);

    //var html = Can.mustache(content).render(data);
    //return View.safeString(html);
  };

  // tag maps
  Util.Object.extend(Can.view.elements.tagMap, {
    //    'div': 'div'
  });

  module.exports = View;

});
