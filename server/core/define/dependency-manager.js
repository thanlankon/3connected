Dependency = {
  libs: {
    // core libs
    Http: require('http'),
    Https: require('https'),
    FileSystem: require('fs'),
    Path: require('path'),
    MakeDir: require('mkdirp'),
    Crypto: require('crypto'),

    // vendor libs
    Express: require('express'),
    BodyParser: require('body-parser'),
    CookieParser: require('cookie-parser'),
    HandleBars: require('handlebars'),
    Sequelize: require('sequelize'),

    Underscore: require('underscore'),
    MiniMatch: require('minimatch'),
    Moment: require('moment'),

    UidSafe: require('uid-safe'),

    NodeGcm: require('node-gcm'),

    Winston: require('winston')
  },

  modules: {},

  define: function (id, definer) {
    var module = Dependency.modules[id];

    if (module) {
      throw new Error('Module already exists: ' + id);
    }

    module = {
      definer: definer,
      resolved: false,
      exports: null
    };

    Dependency.modules[id] = module;
  },

  require: function (id) {
    var module = Dependency.modules[id];

    if (!module) {
      throw new Error('Module not found: ' + id);
    }

    var exec;
    if (!module.resolved) {
      exec = module.definer(module, Dependency.require, Dependency.libs);

      module.resolved = true;
    }

    return module.exports; // || exec;
  },

  resolve: function () {
    var ids = Object.keys(Dependency.modules),
      id;

    for (var i in ids) {
      Dependency.require(ids[i]);
    }
  }
};
