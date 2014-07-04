// global define

define = Dependency.define;

// define main

define.main = function (definer) {
  // resolve dependencies
  Dependency.resolve();

  // exec main
  definer(Dependency.require);
};

// core libs

define('lib.FileSystem', function (module, require, libs) {
  module.exports = libs.FileSystem;
});

define('lib.Path', function (module, require, libs) {
  module.exports = libs.Path;
});

define('lib.Crypto', function (module, require, libs) {
  module.exports = libs.Crypto;
});

// vendor libs

define('lib.Express', function (module, require, libs) {
  module.exports = libs.Express;
});

define('lib.BodyParser', function (module, require, libs) {
  module.exports = libs.BodyParser;
});

define('lib.CookieParser', function (module, require, libs) {
  module.exports = libs.CookieParser;
});

define('lib.HandleBars', function (module, require, libs) {
  module.exports = libs.HandleBars;
});

define('lib.Sequelize', function (module, require, libs) {
  module.exports = libs.Sequelize;
});

define('lib.Underscore', function (module, require, libs) {
  module.exports = libs.Underscore;
});

define('lib.MiniMatch', function (module, require, libs) {
  module.exports = libs.MiniMatch;
});

define('lib.Moment', function (module, require, libs) {
  module.exports = libs.Moment;
});

define('lib.UidSafe', function (module, require, libs) {
  module.exports = libs.UidSafe;
});
