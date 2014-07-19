/*
 * System          : 3connected
 * Component       : Notification service
 * Creator         : TrongND
 * Created date    : 2014/07/19
 */

define.service('service.Notification', function (service, require, ServiceUtil, Util) {

  service.map = {
    url: '/notification',

    authorize: function (req, authentication, Role, commit) {
      commit(authentication.isAuthenticated);
    },

    methods: {
      notifyNews: {
        url: '/notifyNews',
        httpMethod: 'POST'
      }
    }
  };

  var NotificationModel = require('model.Notification');

  service.notifyNews = function (req, res) {

    var newsId = req.body.newsId;
    var userIds = req.body.userIds;

    var serviceResponse = {
      error: null,
      message: null,
      data: null
    };

    NotificationModel.getIds(userIds, function (error, ids) {
      if (error) {
        serviceResponse.message = 'profile.notifyNews.error.unknown';
        serviceResponse.error = error;
      } else {
        serviceResponse.data = ids;
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  };

});
