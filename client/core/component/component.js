define('core.component.Component', function (module, require) {

  var Can = require('lib.Can');
  var jQuery = require('lib.jQuery');

  var View = require('core.view.View');
  var Map = require('core.observe.Map');
  var Route = require('core.route.Route');

  var component = module.exports = Can.Control.extend({

    tmpl: undefined,

    setup: function () {
      this._super.apply(this, arguments);

      this.static = this;
    },

    tmplUrl: function (tmpl) {
      return 'resource/template/' + this.static.tmpl;
    }

  }, {
    data: null,

    init: function (element, options) {
      this._super.apply(this, arguments);

      this.data = new Can.Map();

      this.static = this.constructor;

      if (this.initData) {
        this.initData(element, options);
      }

      if (this.initComponent) {
        this.initComponent(element, options);
      }

      if (this.beforeInitView) {
        this.beforeInitView(element, options);
      }

      if (this.static.tmpl) {
        this.view(function (view) {
          if (this.initView) {
            this.initView(view);
          }

          if (this.ready) {
            this.ready();
          }

          if (this.showForm) {
            var params = Route.attr();
            this.showForm(params);
          }
        });
      }
    },

    ready: function () {},

    initData: function () {},

    view: function (callback) {
      if (!(this.data instanceof Map)) {
        this.data = new Map(this.data);
      }

      var view = View.make(this.static.tmplUrl(), this.data, this.proxy(callback));

      return view;
    },

  });

});
