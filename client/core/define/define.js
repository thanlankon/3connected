// global define

define = Dependency.define;

// define main

define.main = function (definer) {
  // resolve dependencies
  Dependency.resolve();

  // set global theme for jqwidgets
  jQuery.jqx.theme = 'metro';

  // exec main
  definer(Dependency.require);
};

// libs

define('lib.Can', function (module, require, libs) {
  module.exports = libs.Can;
});

define('lib.jQuery', function (module, require, libs) {
  module.exports = libs.jQuery;
});

define('lib.Underscore', function (module, require, libs) {
  module.exports = libs.Underscore;
});

define('lib.Moment', function (module, require, libs) {
  module.exports = libs.Moment;
});

define('lib.Numeral', function (module, require, libs) {
  module.exports = libs.Numeral;
});

define('lib.ExcelBuilder', function (module, require, libs) {
  module.exports = libs.ExcelBuilder;
});

define('lib.FileSaver', function (module, require, libs) {
  module.exports = {
    saveAs: libs.FileSaver
  };
});
