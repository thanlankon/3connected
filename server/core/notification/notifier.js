define('core.notification.Notifier', function (module, require) {

  module.exports = {
    notifyForMobile: notifyForMobile
  };

  function notifyForMobile(registrationIds, data, callback) {

    var NodeGcm = require('lib.NodeGcm');
    var NotificationConfig = require('config.Notification');

    var collapseKey = data.notificationType + '-' + data.notifyFor + '-' + data.dataId;

    var message = new NodeGcm.Message({
      collapseKey: collapseKey,
      delayWhileIdle: true,
      timeToLive: 3,
      data: {
        senderId: data.senderId,
        notificationType: data.notificationType,
        dataId: data.dataId,
        message: data.message
      }
    });

    var apiKey = NotificationConfig.Provider.GCM.API_KEY;
    var retryTimes = NotificationConfig.PushNotification.RETRIES;

    var sender = new NodeGcm.Sender(apiKey);

    // callback with error = null to skip sending
    callback(null, []);
    return;

    sender.send(message, registrationIds, retryTimes, function (error, result) {
      callback(error, result);
    });

  }

});
