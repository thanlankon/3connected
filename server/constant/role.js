define('enum.Role', function (module, require) {

  var Role = {
    UNKNOWN: 0,
    ADMINISTRATOR: 1,
    EDUCATOR: 2,
    EXAMINATOR: 3,
    NEWS_MANAGER: 4,
    STUDENT: 5,
    PARENT: 6,
  };

  module.exports = Role;

});
