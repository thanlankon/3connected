define('app.App', function (module, require) {

  var express = require('lib.Express');
  var app = express();

  var bodyParser = require('lib.BodyParser');
  var cookieParser = require('lib.CookieParser');

  app.use(bodyParser({
    limit: 1024 * 1024 * 10,
  }));

  app.use(cookieParser());

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
