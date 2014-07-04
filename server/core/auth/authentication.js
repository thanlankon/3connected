define('core.auth.Authentication', function (module, require) {

  var Authentication = {};

  Authentication.encryptPassword = function (password) {
    var Crypto = require('lib.Crypto');

    var md5Hash = Crypto.createHash('md5');

    return md5Hash.update(password).digest('hex');
  };

  Authentication.generateAccessToken = function () {
    var UidSafe = require('lib.UidSafe');

    return UidSafe.sync(32);
  };

  module.exports = Authentication;

});
