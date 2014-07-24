define('router.Api', function (module, require) {

  var express = require('lib.Express');
  var ServiceContainer = require('core.service.ServiceContainer');
  var ServiceUtil = require('core.service.ServiceUtil');
  var Role = require('enum.Role');

  var apiRouter = express.Router();

  var AuthenticationMiddleware = require('router.middleware.AuthenticationMiddleware');
  apiRouter.use(AuthenticationMiddleware);

  apiRouter.get('/', function (req, res) {
    res.send('api');
  });

  // get service maps
  var serviceMaps = ServiceContainer.getServiceMaps();

  // add service router to api router
  for (var i = 0, len = serviceMaps.length; i < len; i++) {
    var serviceMap = serviceMaps[i];

    addService(serviceMap, apiRouter);
  }

  function addService(serviceMap, apiRouter) {
    var serviceRouter = express.Router();

    var methodMaps = serviceMap.methods;

    for (var i = 0, len = methodMaps.length; i < len; i++) {
      var methodMap = methodMaps[i];

      addServiceMethod(methodMap, serviceRouter);
    }

    apiRouter.use(serviceMap.url, serviceRouter);
  }

  function addServiceMethod(methodMap, serviceRouter) {

    var httpMethod = methodMap.httpMethod.toLowerCase();

    serviceRouter[httpMethod](methodMap.url, function (req, res) {

      var authentication = req.authentication;
      var authorizator = methodMap.authorizator;

      if (authorizator) {
        if (authentication.isAuthenticated) {
          authorizator(req, authentication, Role, commit);
        } else {
          commit(false, true);
        }
      } else {
        commit(true);
      }

      function commit(authorized, requireLogin) {
        if (authorized) {
          methodMap.method(req, res);
          return;
        }

        var error = {
          code: requireLogin ? 'AUTHENTICATION.REQUIRE_AUTHENTICATE' : 'AUTHENTICATION.PERMISSION_DENIED'
        };

        ServiceUtil.sendServiceResponse(res, error);
      }

    });

  }

  // export router

  module.exports = apiRouter;

});
