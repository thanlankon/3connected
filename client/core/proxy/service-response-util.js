define('core.proxy.ServiceResponseUtil', function (module, require) {

  var MsgBox = require('component.common.MsgBox');
  var Lang = require('core.lang.Lang');
  var Util = require('core.util.Util');

  var ServiceResponseUtil = module.exports = {};

  ServiceResponseUtil.handleServiceResponse = function (serviceResponse) {

    if (serviceResponse.hasMessage()) {
      var message = serviceResponse.getMessage();

      var messageId, messageData;

      if (Util.Object.isObject(message)) {
        messageId = message.messageId;
        messageData = {
          entityName: Lang.get(message.messageData.entityName),
          displayAttribute: serviceResponse[message.messageData.displayAttribute]
        };
      } else {
        messageId = message;
        messageData = {};
      }

      Util.Object.extend(messageData, serviceResponse.getData());

      var lang = Lang.get(messageId, messageData);

      MsgBox.alert({
        text: lang,
        icon: serviceResponse.hasError() ? 'error' : 'info'
      });
    }

    if (serviceResponse.hasError()) {
      console.log(serviceResponse.getError(), serviceResponse.getMessage(), serviceResponse.getData());
    }

  }

});
