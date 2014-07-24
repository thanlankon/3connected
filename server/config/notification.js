define('config.Notification', function (module, require) {

  var Notification = {
    Provider: {
      GCM: {
        API_KEY: 'AIzaSyBqDMZUPwjKzAPFNySWaEEtD2F4SsqMLLg'
      }
    },
    PushNotification: {
      RETRIES: 5
    }
  };

  module.exports = Notification;

});
