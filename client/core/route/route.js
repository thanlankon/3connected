define('core.route.Route', function (module, require) {

  var Can = require('lib.Can');

  var Route = Can.route;

  var originalSetState = Route.setState;

  Route.setState = function () {
    console.log('set state');
    originalSetState.apply(this, arguments);

    if (Route.onChange) Route.onChange();
  }

  Can.unbind.call(window, 'hashchange', originalSetState);

  Route.bindings.hashchange.bind = function () {
    Can.bind.call(window, 'hashchange', Route.setState);
  };

  Route.bindings.hashchange.unbind = function () {
    Can.unbind.call(window, 'hashchange', Route.setState);
  };

  Route.define = Route;

  module.exports = Route;

});
