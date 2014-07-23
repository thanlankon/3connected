/*
 * System          : 3connected
 * Component       : Notification model
 * Creator         : TrongND
 * Created date    : 2014/07/19
 */

define.model('model.Notification', function (model, ModelUtil, require) {

  var Notification = require('model.entity.Notification');
  var NotifyRegistration = require('model.entity.NotifyRegistration');
  var DataType = require('core.model.DataType');

  model.Entity = Notification;

  model.methodConfig = {
    findAll: {
      buildWhereClause: function (findOptions, options, helpers) {
        var NotificationType = require('enum.NotificationType');

        var message = options.params.message;

        if (message) {
          var notificationTypeColumn = helpers.buildColumnName('notificationType', Notification.tableName);

          var appendWhere = [
            ' AND ((',
            notificationTypeColumn,
            ' = ',
            NotificationType.NEWS,
            ' AND ',
            helpers.buildColumnName('news.title', Notification.tableName),
            ' LIKE ?',
            ') OR (',
            notificationTypeColumn,
            ' != ',
            NotificationType.NEWS,
            ' AND ',
            helpers.buildColumnName('course.courseName', Notification.tableName),
            ' LIKE ?',
            '))'
          ].join('');

          findOptions.where[0] += appendWhere;
          findOptions.where.push('%' + message + '%', '%' + message + '%');
        }
      }
    }
  };

  model.notifyNews = function (newsId, senderId, ids, callback) {
    var NotificationType = require('enum.NotificationType');
    var News = require('model.entity.News');

    News.find(newsId)
      .success(function (news) {

        if (news == null) {
          callback({
            error: 'ENTITY.NOT_FOUND'
          });
          return;
        }

        var message = news.title;

        getUserIds(ids, function (error, userIds) {
          if (error) {
            callback(error);
          } else {
            doNotify(senderId, userIds, NotificationType.NEWS, newsId, message, callback);
          }
        });

      })
      .error(function (error) {
        callback(error);
      });
  };

  model.notifyGrade = function (courseId, senderId, callback) {
    var NotificationType = require('enum.NotificationType');
    var Course = require('model.entity.Course');

    var ids = 'course:students,parents[' + courseId + ']';

    Course.find(courseId)
      .success(function (course) {

        if (course == null) {
          callback({
            error: 'ENTITY.NOT_FOUND'
          });
          return;
        }

        var message = course.courseName;

        getUserIds(ids, function (error, userIds) {
          if (error) {
            callback(error);
          } else {
            doNotify(senderId, userIds, NotificationType.GRADE, courseId, message, callback);
          }
        });

      })
      .error(function (error) {
        callback(error);
      });
  };

  model.notifyAttendance = function (courseId, senderId, callback) {
    var NotificationType = require('enum.NotificationType');
    var Course = require('model.entity.Course');

    var ids = 'course:students,parents[' + courseId + ']';

    Course.find(courseId)
      .success(function (course) {

        if (course == null) {
          callback({
            error: 'ENTITY.NOT_FOUND'
          });
          return;
        }

        var message = course.courseName;

        getUserIds(ids, function (error, userIds) {
          if (error) {
            callback(error);
          } else {
            doNotify(senderId, userIds, NotificationType.ATTENDANCE, courseId, message, callback);
          }
        });

      })
      .error(function (error) {
        callback(error);
      });
  };

  function doNotify(senderId, userIds, type, dataId, message, callback) {
    var Entity = require('core.model.Entity');
    var NotifyFor = require('enum.NotifyFor');
    var Notifier = require('core.notification.Notifier');

    Entity.transaction(function (transaction) {

      var queryChainer = Entity.queryChainer();

      userIds.studentIds.forEach(function (userId) {
        queryChainer.add(Notification.create({
          senderId: senderId,
          receiverId: userId,
          notifyFor: NotifyFor.STUDENT,
          notificationType: type,
          dataId: dataId
        }));
      });
      userIds.parentIds.forEach(function (userId) {
        queryChainer.add(Notification.create({
          senderId: senderId,
          receiverId: userId,
          notifyFor: NotifyFor.PARENT,
          notificationType: type,
          dataId: dataId
        }));
      });

      queryChainer
        .run()
        .success(function (results) {

          var notifyData = {
            senderId: senderId,
            notificationType: type,
            dataId: dataId,
            message: message
          }

          Notifier.notifyForMobile(userIds.registrationIds, notifyData, function (error, results) {
            if (error) {
              callback(error);
              return;
            }

            transaction.commit();
            callback(null);
          });
        })
        .error(function (error) {
          transaction.rollback();

          callback(error);
        });

    });
  }

  function getUserIds(items, callback) {
    items = [].concat(items);

    var CourseStudent = require('model.entity.CourseStudent');
    var Student = require('model.entity.Student');
    var Entity = require('core.model.Entity');

    var ids = {
      studentIds: {},
      parentIds: {}
    }

    var queryChainer = Entity.queryChainer();

    var forUsers = [];

    for (var i = 0, len = items.length; i < len; i++) {
      var item = parseId(items[i]);

      if (!item.valid) continue;

      switch (item.type) {
      case 'all':
        queryChainer.add(Student.findAll({
          attributes: ['studentId']
        }));

        forUsers.push(item.user);
        break;
      case 'class':
        queryChainer.add(Student.findAll({
          where: {
            classId: item.id
          },
          attributes: ['studentId']
        }));

        forUsers.push(item.user);
        break;
      case 'course':
        queryChainer.add(CourseStudent.findAll({
          where: {
            courseId: item.id
          },
          attributes: ['studentId']
        }));

        forUsers.push(item.user);
        break;
      case 'specific':
        switch (item.user) {
        case 'students':
          ids.studentIds[item.id] = true;
          break;
        case 'parents':
          ids.parentIds[item.id] = true;
          break;
        case 'students,parents':
          ids.studentIds[item.id] = true;
          ids.parentIds[item.id] = true;
          break;
        }
        break;
      }
    }

    queryChainer
      .run()
      .success(function (results) {
        for (var i = 0, resultLen = results.length; i < resultLen; i++) {
          var items = results[i];

          for (var j = 0, itemLen = items.length; j < itemLen; j++) {
            var item = items[j];

            switch (forUsers[i]) {
            case 'students':
              ids.studentIds[item.studentId] = true;
              break;
            case 'parents':
              ids.parentIds[item.studentId] = true;
              break;
            case 'students,parents':
              ids.studentIds[item.studentId] = true;
              ids.parentIds[item.studentId] = true;
              break;
            }
          }
        }

        var Util = require('core.util.Util');

        // convert to list of ids
        var listOfIds = {
          studentIds: Util.Object.keys(ids.studentIds),
          parentIds: Util.Object.keys(ids.parentIds)
        }

        findRegistrationIds(listOfIds, callback);
      })
      .error(function (error) {
        callback(error);
      });

    function findRegistrationIds(listOfIds, callback) {
      var NotifyFor = require('enum.NotifyFor');

      NotifyRegistration.findAll({
        where: DataType.or(
          DataType.and({
            receiverId: listOfIds.studentIds
          }, {
            registerFor: NotifyFor.STUDENT
          }),
          DataType.and({
            receiverId: listOfIds.parentIds
          }, {
            registerFor: NotifyFor.PARENT
          })
        )
      })
        .success(function (registrations) {
          var registrationIds = [];

          for (var i = 0, len = registrations.length; i < len; i++) {
            registrationIds.push(registrations.registrationKey);
          }

          listOfIds.registrationIds = registrationIds;

          callback(null, listOfIds);
        })
        .error(function (error) {
          callback(error);
        });
    }
  }

  function parseId(id) {
    var parsedId = {
      valid: false
    };

    // type:user[id]
    var tokens = id.match(/(.+)\:(.+)\[(.*)\]/);

    if (tokens.length != 4) return parsedId;

    var userId = +tokens[3];
    var user = tokens[2];

    parsedId.valid = ['students', 'parents', 'students,parents'].indexOf(user) !== -1 && !isNaN(userId);
    parsedId.type = tokens[1];
    parsedId.user = user;
    parsedId.id = userId;

    return parsedId;
  }

});
