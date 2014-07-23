define.form('component.form.notification.NotificationExplorer', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'notification'
    }
  };

  form.tmpl = 'form.notification.notification-explorer';

  form.formType = form.FormType.Form.LIST;

  //form.exportConfig = require('export.Notification');

  form.ServiceProxy = require('proxy.Notification');

  form.initData = function () {

    var NotificationType = require('enum.NotificationType');

    var componentSettings = {
      notificationType: {
        localDataAttribute: 'notificationTypes',
        combobox: {
          valueMember: 'type',
          displayMember: 'text'
        }
      }
    };

    var notificationTypes = [{
      type: NotificationType.ALL,
      text: Lang.get('notification.all')
    }, {
      type: NotificationType.NEWS,
      text: Lang.get('notification.news')
    }, {
      type: NotificationType.GRADE,
      text: Lang.get('notification.grade')
    }, {
      type: NotificationType.ATTENDANCE,
      text: Lang.get('notification.attendance')
    }];

    this.data.attr({
      notificationType: NotificationType.ALL,
      notificationTypes: notificationTypes,
      componentSettings: componentSettings
    });

  };

  form.initForm = function () {
    this.buttonSearchNotification = this.element.find('#button-search-notification');
    this.buttonSearchNotification.click(this.proxy(this.searchNotification));

    this.buttonViewNotification = this.element.find('#button-view-notification');
  };

  form.searchNotification = function () {
    var NotificationType = require('enum.NotificationType');

    var notificationType = this.data.attr('notificationType');
    var message = this.data.attr('message') || '';

    if (notificationType === NotificationType.ALL) {
      notificationType = null;
    }
    if (message.trim().length == 0) {
      message = null;
    }

    this.grid.setFilterConditions('notificationType', notificationType, true);
    this.grid.setParams('message', message);
  };

  form.updateViewNotificationUrl = function (entityId, row) {
    var NotificationType = require('enum.NotificationType');
    var Route = require('core.route.Route');

    switch (row.notificationType) {
    case NotificationType.ATTENDANCE:
      this.buttonViewNotification.attr('href', Route.url({
        module: 'student-course',
        action: 'attendance',
        id: row.dataId
      }));
      break;
    case NotificationType.GRADE:
      this.buttonViewNotification.attr('href', Route.url({
        module: 'course',
        action: 'grade',
        id: row.dataId
      }));
      break;
    case NotificationType.NEWS:
      this.buttonViewNotification.attr('href', Route.url({
        module: 'news',
        action: 'detail',
        id: row.dataId
      }));
      break;
    }
  };

  // grid config
  form.gridConfig = function () {
    var NotificationType = require('enum.NotificationType');

    var gridColumns = [{
      text: Lang.get('notification.type'),
      dataField: 'notificationType',
      width: 130,
      cellsRenderer: function (row, columnField, value) {
        switch (value) {
        case NotificationType.NEWS:
          var text = Lang.get('notification.news');
          text = '<span class="notification notification-news">' + text + '</span>';

          break;
        case NotificationType.ATTENDANCE:
          var text = Lang.get('notification.attendance');
          text = '<span class="notification notification-attendance">' + text + '</span>';

          break;
        case NotificationType.GRADE:
          var text = Lang.get('notification.grade');
          text = '<span class="notification notification-grade">' + text + '</span>';

          break;
        }

        return text;
      }
    }, {
      text: Lang.get('notification.sender'),
      dataField: 'senderName',
      width: 250
    }, {
      text: Lang.get('notification.message'),
      cellsRenderer: function (row, columnField, value) {
        if (row.notificationType == NotificationType.NEWS) {
          return row.newsTitle;
        }

        return row.courseName;
      }
    }, {
      text: Lang.get('notification.time'),
      dataField: 'notificationTime',
      width: 130
    }];

    var gridConfig = {
      columns: gridColumns,
      filterable: false,

      events: {
        singleSelect: this.proxy(this.updateViewNotificationUrl)
      }
    };

    return gridConfig;

  };

});
