/*
 * System          : 3connected
 * Component       : Notification proxy
 * Creator         : TrongND
 * Created date    : 2014/07/19
 */

define.proxy('proxy.Notification', function (proxy, require) {

  proxy.findAll = 'GET api/notification/findAll';

  proxy.notifyNews = 'POST api/notification/notifyNews';

  // class entity map
  proxy.EntityMap = [
    {
      name: 'notificationId',
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
    }
  ];


});
