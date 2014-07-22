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
    var userIds = req.body.userIds || [];

    var serviceResponse = {
      error: null,
      message: null
    };

    var authentication = req.authentication;
    var senderId = authentication.userInformationId;

    NotificationModel.notifyNews(newsId, senderId, userIds, function (error) {
      if (error) {
        serviceResponse.message = 'notification.notifyNews.error.unknown';
        serviceResponse.error = error;
      } else {
        serviceResponse.message = 'notification.notifyNews.success';
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message);
    });

  };

  service.notifyGrade = function (req, res) {

    var courseId = req.body.courseId;

    var serviceResponse = {
      error: null,
      message: null
    };

    var authentication = req.authentication;
    var senderId = authentication.userInformationId;

    NotificationModel.notifyGrade(courseId, senderId, userIds, function (error) {
      if (error) {
        serviceResponse.message = 'notification.notifyGrade.error.unknown';
        serviceResponse.error = error;
      } else {
        serviceResponse.message = 'notification.notifyGrade.success';
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message);
    });

  };

});
