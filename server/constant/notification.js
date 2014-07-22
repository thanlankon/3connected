define('enum.NotificationType', function (module, require) {

  var NotificationType = {
    GRADE: 1,
    ATTENDANCE: 2,
    NEWS: 3
  };

  module.exports = NotificationType;

});

define('enum.NotifyFor', function (module, require) {

  var NotifyFor = {
    STUDENT: 1,
    PARENT: 2
  };

  module.exports = NotifyFor;

});
