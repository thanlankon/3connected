define('core.proxy.Proxy', function (module, require) {

  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');

  var ServiceResponseUtil = require('core.proxy.ServiceResponseUtil');

  module.exports = {
    //    ProxyUtil: ProxyUtil,
    ProxyMethod: ProxyMethod,
    ServiceResponse: ServiceResponse
  };

  // service response
  function ServiceResponse(responseData) {
    Util.Object.extend(this, responseData.data);

    this._data = responseData.data;
    this._service = responseData._service;
  }

  ServiceResponse.prototype.hasError = function () {
    return !!this._service.error;
  };

  ServiceResponse.prototype.getError = function () {
    return this._service.error;
  };

  ServiceResponse.prototype.hasMessage = function () {
    return !!this._service.message;
  };

  ServiceResponse.prototype.getMessage = function () {
    return this._service.message;
  };

  ServiceResponse.prototype.getData = function () {
    return this._data;
  };

  // proxy method
  function ProxyMethod(url, httpMethod) {
    this.url = url;
    this.httpMethod = httpMethod;
  }

  ProxyMethod.prototype.doRequest = function (requestData, callback) {
    console.log('do request', requestData);

    jQuery('.cpanel > .loading').fadeIn(100);

    var ajax = jQuery.ajax({
      type: this.httpMethod,
      url: this.url,
      data: requestData
    });

    if (callback) {
      ajax.done(function (responseData) {
        jQuery('.cpanel > .loading').fadeOut(100);

        var serviceResponse = new ServiceResponse(responseData);

        ServiceResponseUtil.handleServiceResponse(serviceResponse);

        if (callback) {
          callback(serviceResponse);
        }
      });
    } else {
      return ajax;
    }

  };

  // global ajax error handler
  jQuery(document).ajaxError(function (error) {
    console.log(error);

    jQuery('.cpanel > .loading').fadeOut(100);

    var MsgBox = require('component.common.MsgBox');
    var Lang = require('core.lang.Lang');

    MsgBox.alert({
      text: Lang.get('error.ajax'),
      icon: 'error'
    });
  });

  //  var ProxyUtil = {
  //    async: function () {
  //      var args = Util.Collection.toArray(arguments);
  //      var ajax = args.slice(0, -1);
  //      var callback = args.slice(-1);
  //
  //      jQuery.when
  //        .apply(null, ajax)
  //        .done(function () {
  //          var responses = Util.Collection.toArray(arguments);
  //
  //          for (var i = 0, len = responses.length; i < len; i++) {
  //            var serviceResponse = new ServiceResponse(responses[i]);
  //            ServiceResponseUtil.handleServiceResponse(serviceResponse);
  //
  //            responses[i] = serviceResponse;
  //          }
  //
  //          callback.apply(null, responses);
  //        });
  //    }
  //  };

});
