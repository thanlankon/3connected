define('router.Resource', function (module, require) {

  var express = require('lib.Express');
  var resourceRouter = express.Router();

  var resource = require('resource.loader.Resource');
  var ResourceConfig = require('resource.Config');

  module.exports = resourceRouter;

  resourceRouter.get('/template/:templateId', function (req, res) {
    var templateId = req.params.templateId;

    var templateExtension = ".mustache";

    if (templateId.slice(templateId.length - templateExtension.length) == templateExtension) {
      templateId = templateId.slice(0, -templateExtension.length);
    }

    var Resource = resource.getResource();

    if (!templateId || !Resource.templates[templateId]) {
      return res.send(404, 'Template not found');
    }

    var content = Resource.templates[templateId];

    res.send(content);
  });

  resourceRouter.use('/', express.static(ResourceConfig.Location.ROOT));

});
