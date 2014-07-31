Dependency = {
  libs: {
    Can: can,
    jQuery: $,
    Underscore: _,
    Moment: moment,
    Numeral: numeral,

    ExcelBuilder: ExcelBuilder,
    FileSaver: saveAs,
    Xls: XLS,
    Xlsx: XLSX
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
    var ids = Dependency.libs.Underscore.keys(Dependency.modules),
      id;

    for (var i in ids) {
      Dependency.require(ids[i]);
    }
  }
};
