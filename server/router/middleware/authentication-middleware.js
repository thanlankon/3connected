define('router.middleware.AuthenticationMiddleware', function (module, require) {

  var AuthenticationModel = require('model.Authentication');

  // export middleward
  module.exports = AuthenticationMiddleware;

  function AuthenticationMiddleware(req, res, next) {
    var accessToken = req.cookies.accessToken || req.get('Access-Token');

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

        authenticationInfo.isAuthenticated = true;

        authenticationInfo.accessToken = accessToken;
        authenticationInfo.accountId = accessTokenInfo.account.accountId;
        authenticationInfo.accountRole = accessTokenInfo.account.role;
        authenticationInfo.userInformationId = accessTokenInfo.account.userInformationId;

        next();
      });
    } else {
      next();
    }
  }

});
