define('router.App', function (module, require) {

  var appRouter = require('lib.Express').Router();
  var resource = require('resource.loader.Resource');

  module.exports = appRouter;

  appRouter.get('/', function (req, res) {
    var authentication = req.authentication;

    var Resource = resource.getResource(true);

    if (authentication.isAuthenticated) {
      var content = Resource.appPage({});
    } else {
      var content = Resource.loginPage({});
    }

    res.send(content);
  });

});
