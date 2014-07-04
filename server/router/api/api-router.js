define('router.Api', function (module, require) {

  var express = require('lib.Express');
  var ServiceContainer = require('core.service.ServiceContainer');
  var ServiceUtil = require('core.service.ServiceUtil');

  var apiRouter = express.Router();

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
      //      res.sendServiceResponse = function (error, object) {
      //        ServiceUtil.sendServiceResponse(res, error, object);
      //      };

      methodMap.method(req, res);

      //      var serviceDomain = require('lib.Domain').create();
      //
      //      serviceDomain.add(req);
      //      serviceDomain.add(res);
      //
      //      serviceDomain.on('error', function (error) {
      //        console.error('Error', error, req.url);
      //
      //        try {
      //          res.writeHead(500);
      //          res.end('Error occurred, sorry.');
      //        } catch (er) {
      //          console.error('Error sending 500', error, req.url);
      //        }
      //      });
      //
      //      serviceDomain.run(function () {
      //        methodMap.method(req, res);
      //      });

    });
  }

  // export router

  module.exports = apiRouter;

});
