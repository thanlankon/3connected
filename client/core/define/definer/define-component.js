define.component = function (id, definer) {

  define(id, function (module, require) {

    var Util = require('core.util.Util');
    var Lang = require('core.lang.Lang');
    var jQuery = require('lib.jQuery');

    var component = {
      static: {},
      events: {}
    };

    definer(component, require, Util, Lang, jQuery);

    var basecomponent = require(component.base || 'core.component.Component');

    // singleton
    if (component.singleton) {
      component.static.newInstance = function () {
        if (!this.static._instance) {
          this.static._instance = this._super.apply(this, arguments);
        }

        return this.static._instance;
      };

      component.static.hasInstance = function () {
        return !!this.static._instance;
      };

      component.static.getInstance = function () {
        return this.static._instance;
      };

      component.static.destroyInstance = function () {
        return this.static._instance = null;
      };
    }

    var staticMembers = component.static;

    // component template
    if (component.tmpl) {
      staticMembers.tmpl = component.tmpl;
    }

    // auto inheritance for setup method
    if (component.setup) {
      staticMembers.setup = function () {
        this._super.apply(this, arguments);

        component.setup.apply(this, arguments);
      };
    }

    var instanceMembers = Util.Object.omit(component, ['isDialog', 'tmpl', 'setup', 'static', 'events', 'init']);

    // auto inheritance for init method
    if (component.init) {
      instanceMembers.init = function () {
        this._super.apply(this, arguments);

        component.init.apply(this, arguments);
      };
    }

    // auto inheritance for ready method
    if (component.ready) {
      instanceMembers.ready = function () {
        this._super.apply(this, arguments);

        component.ready.apply(this, arguments);
      };
    }

    Util.Object.extend(instanceMembers, component.events);

    module.exports = basecomponent.extend(id, staticMembers, instanceMembers);

  });

};
