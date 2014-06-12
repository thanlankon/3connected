define('core.proxy.ServiceResponseUtil', function (module, require) {

  var MsgBox = require('component.common.MsgBox');
  var Lang = require('core.lang.Lang');

  var ServiceResponseUtil = module.exports = {};

  ServiceResponseUtil.handleServiceResponse = function (serviceResponse) {

    if (serviceResponse.hasMessage()) {
      var lang = Lang.get(serviceResponse.getMessage(), serviceResponse);

      MsgBox.alert(lang);
    }

  }

});
