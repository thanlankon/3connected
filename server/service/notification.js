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
      findAll: {
        authorize: function (req, authentication, Role, commit) {
          var NotifyFor = require('enum.NotifyFor');

          if (Role.isStudentOrParent(authentication.accountRole)) {
            req.query.filters = req.query.filters || [];

            req.query.filters.push({
              field: 'receiverId',
              value: authentication.userInformationId
            });

            req.query.filters.push({
              field: 'notifyFor',
              value: Role.isStudent(authentication.accountRole) ? NotifyFor.STUDENT : NotifyFor.PARENT
            });

            commit(true);

            return;
          };

          commit(false);
        },
      },
      notifyNews: {
        url: '/notifyNews',
        httpMethod: 'POST'
      },
      notifyGrade: {
        url: '/notifyGrade',
        httpMethod: 'POST'
      },
      notifyAttendance: {
        url: '/notifyAttendance',
        httpMethod: 'POST'
      }
    }
  };

  var NotificationModel = require('model.Notification');
  var StaffModel = require('model.Staff');
  var NewsModel = require('model.News');
  var CourseModel = require('model.Course');

  service.Model = NotificationModel;

  service.methodConfig = {
    idAttribute: 'notificationId',

    message: {
      entityName: 'notification',
      displayAttribute: 'notificationId'
    },

    findAll: {
      buildFindOptions: function (findOptions, query) {

        findOptions.params = {
          message: query.message
        };

        findOptions.include = [{
          model: StaffModel,
          as: 'sender'
        }, {
          model: NewsModel,
          as: 'news'
        }, {
          model: CourseModel,
          as: 'course'
        }];
      }
    }
  };

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

    NotificationModel.notifyGrade(courseId, senderId, function (error) {
      if (error) {
        serviceResponse.message = 'notification.notifyGrade.error.unknown';
        serviceResponse.error = error;
      } else {
        serviceResponse.message = 'notification.notifyGrade.success';
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message);
    });

  };

  service.notifyAttendance = function (req, res) {

    var courseId = req.body.courseId;

    var serviceResponse = {
      error: null,
      message: null
    };

    var authentication = req.authentication;
    var senderId = authentication.userInformationId;

    NotificationModel.notifyAttendance(courseId, senderId, function (error) {
      if (error) {
        serviceResponse.message = 'notification.notifyAttendance.error.unknown';
        serviceResponse.error = error;
      } else {
        serviceResponse.message = 'notification.notifyAttendance.success';
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message);
    });

  };

});
