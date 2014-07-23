/*
 * System          : 3connected
 * Component       : Notification proxy
 * Creator         : TrongND
 * Created date    : 2014/07/19
 */

define.proxy('proxy.Notification', function (proxy, require) {

  proxy.entityId = 'notificationId';

  proxy.findAll = 'GET api/notification/findAll';
  proxy.destroy = 'POST api/notification/destroy';

  proxy.notifyNews = 'POST api/notification/notifyNews';
  proxy.notifyGrade = 'POST api/notification/notifyGrade';
  proxy.notifyAttendance = 'POST api/notification/notifyAttendance';

  // class entity map
  proxy.EntityMap = [
    {
      name: 'notificationId',
      type: 'number'
    },
    {
      name: 'notificationType',
      type: 'number'
    },
    {
      name: 'senderName',
      type: 'string',
      map: 'sender.staffCode'
    },
    {
      name: 'newsTitle',
      type: 'string',
      map: 'news.title'
    },
    {
      name: 'courseName',
      type: 'string',
      map: 'course.courseName'
    },
    {
      name: 'notificationType',
      type: 'number'
    },
    {
      name: 'dataId',
      type: 'number'
    },
    {
      name: 'notificationTime',
      type: 'string'
    }
  ];


});
