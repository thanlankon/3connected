define('router.App', function (module, require) {

  var appRouter = require('lib.Express').Router();
  var resource = require('resource.loader.Resource');

  var Configuration = require('core.config.Configuration').getConfiguration();

  module.exports = appRouter;

  var AuthenticationMiddleware = require('router.middleware.AuthenticationMiddleware');
  appRouter.use(AuthenticationMiddleware);

  appRouter.get('/', function (req, res) {
    var authentication = req.authentication;

    var Resource = resource.getResource(Configuration.ENABLE_DEVELOPMENT);

    if (authentication.isAuthenticated) {
      var content = Resource.appPage({
        authentication: authentication
      });
    } else {
      var content = Resource.loginPage({});
    }

    res.send(content);
  });

});
