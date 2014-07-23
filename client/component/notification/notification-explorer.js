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

  // grid config
  form.gridConfig = function () {
    var NotificationType = require('enum.NotificationType');

    var gridColumns = [{
      text: Lang.get('notification.notificationId'),
      dataField: 'notificationId'
    }, {
      text: Lang.get('notification.sender'),
      dataField: 'senderName'
    }, {
      text: Lang.get('notification.message'),
      cellsRenderer: function (row, columnField, value) {
        if (row.notificationType == NotificationType.NEWS) {
          return row.newsTitle;
        }

        return row.courseName;
      }
    }];

    var gridConfig = {
      columns: gridColumns,
      filterable: false
    };

    return gridConfig;

  };

});
