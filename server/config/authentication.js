define('config.Authentication', function (module, require) {

  var AuthenticationConfig = {
    TimeToLive: {
      SESSION: 30, // 30 minutes
      REMEMBER: 60 * 24 * 7 // 1 week
    }
  };

  module.exports = AuthenticationConfig;

});
