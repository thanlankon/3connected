define('router.middleware.AuthenticationMiddleware', function (module, require) {

  var AuthenticationModel = require('model.Authentication');

  // export middleward
  module.exports = AuthenticationMiddleware;

  function AuthenticationMiddleware(err, req, res, next) {
    if (err) {
      next();
      return;
    }

    var accessToken = req.cookies.accessToken;

    var authenticationInfo = req.authentication = {
      isAuthenticated: false
    };

    if (accessToken) {
      AuthenticationModel.retrieveAccessTokenInfo(accessToken, function (error, accessTokenInfo) {
        if (error) {
          authenticationInfo.error = error;
          next();
          return;
        }
        if (accessTokenInfo == null) {
          next();
          return;
        }

        authenticationInfo.accessToken = accessToken;
        authenticationInfo.accountId = accessTokenInfo.accountId;
        authenticationInfo.isAuthenticated = true;
      });
    }
  }

});
