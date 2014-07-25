define('enum.GradeStatus', function (module, require) {

  var GradeStatus = {
    UNKNOWN: 0,
    PASS: 1,
    FAIL: 2
  };

  module.exports = GradeStatus;

});

define('constant.Grade', function (module, require) {

  var GradeConstant = {
    PASS_GRADE: 5
  };

  module.exports = GradeConstant;

});
