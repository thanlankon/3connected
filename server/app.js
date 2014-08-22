define('app.App', function (module, require) {

  var express = require('lib.Express');
  var app = express();

  var bodyParser = require('lib.BodyParser');
  var cookieParser = require('lib.CookieParser');

  // init resource
  var resource = require('resource.loader.Resource');
  resource.getResource();

  app.use(bodyParser({
    limit: 1024 * 1024 * 100,
  }));

  app.use(cookieParser());

  // log middleware
  app.use(function (req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
  });

  // router for client's app page
  var appRouter = require('router.App');
  // router for client resource
  var resourceRouter = require('router.Resource');
  // router for service api
  var apiRouter = require('router.Api');

  app.use('/resource', resourceRouter);
  app.use('/', appRouter);
  app.use('/api', apiRouter);

  module.exports = app;

});
