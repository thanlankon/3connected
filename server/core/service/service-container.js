define('core.service.ServiceContainer', function (module, require) {

  var Util = require('core.util.Util');

  var ServiceContainer = {
    ServiceIds: [],

    getServiceMaps: getServiceMaps
  };

  module.exports = ServiceContainer;

  function getServiceMaps() {
    var serviceIds = ServiceContainer.ServiceIds;

    var serviceMaps = [];

    for (i = 0, len = serviceIds.length; i < len; i++) {
      var Service = require(serviceIds[i]);

      var serviceMap = {
        url: Service.map.url,
        methods: []
      };

      var methods = Util.Object.keys(Service.map.methods);

      var serviceAuthorizator = Service.map.authorize;

      for (var j = 0, methodLen = methods.length; j < methodLen; j++) {
        var method = methods[j];
        var methodMap = Service.map.methods[method];
        var methodAuthorizator = methodMap.authorize;

        serviceMap.methods.push({
          url: methodMap.url,
          httpMethod: methodMap.httpMethod,
          method: Service[method],
          authorizator: methodAuthorizator || serviceAuthorizator || undefined
        });
      }

      serviceMaps.push(serviceMap);
    }

    return serviceMaps;
  }

});
