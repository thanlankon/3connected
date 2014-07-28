define('core.auth.AuthenticationUtil', function (module, require) {

  var AuthenticationUtil = {};

  AuthenticationUtil.encryptPassword = function (password) {
    // for development, disable encrypt password
    // return password;

    var Crypto = require('lib.Crypto');

    var md5Hash = Crypto.createHash('md5');

    return md5Hash.update(password).digest('hex');
  };

  AuthenticationUtil.generateAccessToken = function () {
    var UidSafe = require('lib.UidSafe');

    return UidSafe.sync(32);
  };

  module.exports = AuthenticationUtil;

});
