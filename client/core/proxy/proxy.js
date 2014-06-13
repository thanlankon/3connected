define('core.proxy.Proxy', function (module, require) {

  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');

  var ServiceResponseUtil = require('core.proxy.ServiceResponseUtil');

  module.exports = {
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

    jQuery.ajax({
      type: this.httpMethod,
      url: this.url,
      data: requestData
    }).done(function (responseData) {
      var serviceResponse = new ServiceResponse(responseData);

      ServiceResponseUtil.handleServiceResponse(serviceResponse);

      if (callback) {
        callback(serviceResponse);
      }
    });
  };

  // global ajax error handler
  jQuery(document).ajaxError(function (error) {
    console.log(error);

    alert('ajax error');
  });


});
