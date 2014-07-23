define('config.Notification', function (module, require) {

  var Notification = {
    Provider: {
      GCM: {
        API_KEY: ''
      }
    },
    PushNotification: {
      RETRIES: 5
    }
  };

  module.exports = Notification;

});
