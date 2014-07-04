/*
 * System          : 3connected
 * Component       : Authentication service
 * Creator         : TrongND
 * Created date    : 2014/07/04
 */

define.service('service.Authentication', function (service, require, ServiceUtil, Util) {

  var Authentication = require('core.auth.Authentication');

  service.map = {
    url: '/authentication',

    methods: {
      login: {
        url: '/login',
        httpMethod: 'POST'
      },
      logout: {
        url: '/logout',
        httpMethod: 'GET'
      }
    }
  };

  service.login = function (req, res) {

    var username = req.body.username;
    var role = req.body.role;
    var password = req.body.password;
    var remember = req.body.remember;

    var serviceResponse = {
      message: null,
      error: null,
      data: null
    };

    Authentication.login(username, role, password, remember, function (error, isAccountCorrect, loginData) {
      if (error) {
        serviceResponse.message = 'authentication.login.error.unknown';
        serviceResponse.error = error;
      } else if (!isAccountCorrect) {
        serviceResponse.error = {
          code: 'AUTHENTICATION.INCORRECT_ACCOUNT'
        };
        serviceResponse.message = 'authentication.login.incorrectAcount';
      } else {
        // serviceResponse.message = 'authentication.login.success';
        serviceResponse.data = loginData;
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  }

  service.logout = function (req, res) {

    var authentication = req.authentication;

    var accessToken = authentication.accessToken;

    var serviceResponse = {
      message: null,
      error: null,
      data: null
    };

    if (!authentication.isAuthenticated || !accessToken) {
      serviceResponse.error = 'AUTHENTICATION.NOT_AUTHENTICATED';

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
      return;
    }

    Authentication.logout(accessToken, function (error, isLoggedOut) {
      if (error) {
        serviceResponse.message = 'authentication.logout.error.unknown';
        serviceResponse.error = error;
      } else if (!isLoggedOut) {
        serviceResponse.error = {
          code: 'AUTHENTICATION.NOT_LOGGED_OUT'
        };
        serviceResponse.message = 'authentication.logout.error.notLoggedOut';
      } else {
        //serviceResponse.message = 'authentication.login.success';
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });


  }

});
