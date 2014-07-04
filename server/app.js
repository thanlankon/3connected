define('app.App', function (module, require) {

  var express = require('lib.Express');
  var app = express();

  var bodyParser = require('lib.BodyParser');
  var cookieParser = require('lib.CookieParser');

  app.use(bodyParser());
  app.use(cookieParser());

  // router for client's app page
  var appRouter = require('router.App');
  // router for client resource
  var resourceRouter = require('router.Resource');
  // router for service api
  var apiRouter = require('router.Api');

  var AuthenticationMiddleware = require('router.middleware.AuthenticationMiddleware');
  app.use(AuthenticationMiddleware);

  app.use('/resource', resourceRouter);
  app.use('/', appRouter);
  app.use('/api', apiRouter);

  module.exports = app;

});
