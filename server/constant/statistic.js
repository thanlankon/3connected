define('enum.StatisticType', function (module, require) {

  var StatisticType = {
    AVERAGE_GRADE: 1,
    ACCUMULATION_GRADE: 2,
    TOTAL_CREDIT_PASS: 3,
    TOTAL_CREDIT_FAIL: 4,
    TOTAL_CREDIT_UNFINISHED: 5,
    TOTAL_CREDIT: 6
  };

  module.exports = StatisticType;

});
