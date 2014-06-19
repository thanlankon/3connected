define('resource.Config', function (module, require) {

  var path = require('lib.Path');

  var ResourceConfig = {
    Location: {
      ROOT: path.resolve('../client')
    },

    Url: {
      APP: '/',
      SCRIPT: '/resource/scripts'
    },

    App: {
      LOCATION: 'app.tmpl'
    },

    Script: {
      EXT: 'js',
      RULES: [
        // lib - jquery
        'lib/jquery/*',
        // lib - jqwidgets
        /*
        'lib/jqwidgets/jqxcore.js',
        'lib/jqwidgets/jqxdata.js',
        'lib/jqwidgets/jqxscrollbar.js',
        'lib/jqwidgets/jqxpanel.js',
        'lib/jqwidgets/jqxbuttons.js',
        'lib/jqwidgets/jqxmenu.js',
        'lib/jqwidgets/jqxgrid.js',
        'lib/jqwidgets/jqxgrid.filter.js',
        'lib/jqwidgets/*',
        */
        'lib/jqwidgets/jqx-all.js',
        'lib/jqwidgets/*',
        // lib - canjs
        'lib/can/*',
        // lib - others
        'lib/**',
        // core - dependency manager
        'core/define/dependency-manager.js',
        'core/define/define.js',
        'core/define/definer/*',
        // core - others
        'core/**',
        // app - proxies
        'proxy/**',
        // app - components
        'component/**',
        // app - validate rules
        'validator/**',
        // app - export configs
        'export/**',
        // app - constants
        'constant/**',
        // app - routes
        'routes.js'
      ]
    },

    StyleSheet: {
      EXT: 'css',
      RULES: [
        'stylesheet/lib/**',
        'stylesheet/common.css',
        'stylesheet/theme.css',
        'stylesheet/*',
        'stylesheet/**',
      ]
    },

    Lang: {
      EXT: 'lang',
      RULES: [
        'lang/**'
      ]
    },

    Template: {
      EXT: 'tmpl',
      RULES: [
        'template/**'
      ]
    },
  };

  module.exports = ResourceConfig;

});
