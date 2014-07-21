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

  Role.isAdministrator = function (role) {
    return role === Role.ADMINISTRATOR;
  };

  Role.isEducator = function (role) {
    return role === Role.EDUCATOR;
  };

  Role.isExaminator = function (role) {
    return role === Role.EXAMINATOR;
  };

  Role.isNewsManager = function (role) {
    return role === Role.NEWS_MANAGER;
  };

  Role.isStudent = function (role) {
    return role === Role.STUDENT;
  };

  Role.isParent = function (role) {
    return role === Role.PARENT;
  };

  Role.isStudentOrParent = function (role) {
    return Role.isStudent(role) || Role.isParent(role);
  };

  Role.isStaff = function (role) {
    return Role.isEducator(role) || Role.isExaminator(role) || Role.isNewsManager(role);
  };

  Role.isAdministratorOrStaff = function (role) {
    return Role.isAdministrator(role) || Role.isStaff(role);
  };

  module.exports = Role;

});
