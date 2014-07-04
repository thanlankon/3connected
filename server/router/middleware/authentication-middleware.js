define('router.middleware.AuthenticationMiddleware', function (module, require) {

  var AuthenticationModel = require('model.Authentication');

  // export middleward
  module.exports = AuthenticationMiddleware;

  function AuthenticationMiddleware(req, res, next) {
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
        authenticationInfo.accountId = accessTokenInfo.account.accountId;
        authenticationInfo.userInformationId = accessTokenInfo.account.userInformationId;
        authenticationInfo.role = accessTokenInfo.account.role;
        authenticationInfo.isAuthenticated = true;

        next();
      });
    } else {
      next();
    }
  }

});
