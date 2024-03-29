/*
 * System          : 3connected
 * Component       : Profile service
 * Creator         : TrongND
 * Created date    : 2014/07/06
 */

define.service('service.Profile', function (service, require, ServiceUtil, Util) {

  service.map = {
    url: '/profile',

    authorize: function (req, authentication, Role, commit) {
      commit(authentication.isAuthenticated);
    },

    methods: {
      getSimpleProfile: {
        url: '/getSimpleProfile',
        httpMethod: 'GET'
      },

      changePassword: {
        url: '/changePassword',
        httpMethod: 'POST'
      }
    }
  };

  var ProfileModel = require('model.Profile');

  service.getSimpleProfile = function (req, res) {

    var authentication = req.authentication;

    var serviceResponse = {
      error: null,
      message: null,
      data: null
    };

    var accountRole = authentication.accountRole;
    var userInformationId = authentication.userInformationId;

    ProfileModel.getSimpleProfile(accountRole, userInformationId, function (error, profile, isNotFound) {
      if (error) {
        serviceResponse.message = 'profile.getSimpleProfile.error.unknown';
        serviceResponse.error = error;
      } else {
        if (isNotFound) {
          serviceResponse.error = {
            code: 'ENTITY.NOT_FOUND'
          };
          serviceResponse.message = 'profile.getSimpleProfile.notFound';
        } else {
          serviceResponse.data = profile;
        }
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  };

  service.changePassword = function (req, res) {

    var authentication = req.authentication;

    var serviceResponse = {
      error: null,
      message: null,
      data: null
    };

    var accountId = authentication.accountId;
    var currentPassword = req.body.currentPassword;
    var password = req.body.password;

    ProfileModel.changePassword(accountId, currentPassword, password, function (error, profile, isNotFound, isIncorrect) {
      if (error) {
        serviceResponse.message = 'profile.changePassword.error.unknown';
        serviceResponse.error = error;
      } else {
        if (isNotFound) {
          serviceResponse.error = {
            code: 'ENTITY.NOT_FOUND'
          };
          serviceResponse.message = 'profile.getSimpleProfile.error.notFound';
        } else if (isIncorrect) {
          serviceResponse.error = {
            code: 'ENTITY.INVALID_DATA'
          };
          serviceResponse.message = 'profile.changePassword.error.incorrectPassword';
        } else {
          serviceResponse.message = 'profile.changePassword.success';
        }
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  };

});
