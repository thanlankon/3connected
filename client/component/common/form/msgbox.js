define('component.common.MsgBox', function (module, require) {

  var jQuery = require('lib.jQuery');

  module.exports = {
    alert: jQuery.alert,
    confirm: jQuery.confirm
  };

});
