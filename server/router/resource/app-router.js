define('router.App', function (module, require) {

  var appRouter = require('lib.Express').Router();
  var resource = require('resource.loader.Resource');

  module.exports = appRouter;

  appRouter.get('/', function (req, res) {
    var Resource = resource.getResource(true);

    var content = Resource.app({});

    res.send(content);
  });

});
