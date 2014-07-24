define('enum.Relationship', function (module, require) {

  var Relationship = {
    UNKNOWN: 0,
    OTHER: 1,
    FATHER: 2,
    MOTHER: 3,
    GRAND_FATHER: 4,
    GRAND_MOTHER: 5,
    GODPARENT: 6
  };

  module.exports = Relationship;

});
