define.proxy = function (id, definer) {

  define(id, function (module, require) {

    var Util = require('core.util.Util');
    var ProxyMethod = require('core.proxy.Proxy').ProxyMethod;

    var proxy = {};

    definer(proxy, require);

    var Proxy = module.exports = {};

    Util.Collection.each(proxy, function (value, key) {
      if (key === 'id') {
        Proxy.id = value;

        return;
      }

      if (key === 'entityId') {
        Proxy.entityId = value;

        return;
      }

      if (key === 'EntityMap') {
        Proxy.EntityMap = value;

        return;
      }

      var httpMethod = value.slice(0, value.indexOf(' '));
      var url = value.slice(value.indexOf(' ') + 1);

      var proxyMethod = new ProxyMethod(url, httpMethod);

      Proxy[key] = function (data, callback) {
        proxyMethod.doRequest(data, callback);
      };

      Proxy[key].url = proxyMethod.url;
      Proxy[key].httpMethod = proxyMethod.httpMethod;
    });

  });

};
