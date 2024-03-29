define('resource.loader.Resource', function (module, require) {

  module.exports = {
    getResource: getResource
  };

  var ResourceConfig = require('resource.Config');
  var fileUtil = require('core.util.FileUtil');

  var loadAppPage = require('resource.loader.AppPage');
  var loadLoginPage = require('resource.loader.LoginPage');
  var loadScripts = require('resource.loader.Scripts');
  var loadStyleSheets = require('resource.loader.StyleSheets');
  var loadLangs = require('resource.loader.Langs');
  var loadTemplates = require('resource.loader.Templates');

  var Resource = null;

  function getResource(force) {
    if (force || !Resource) {
      Resource = {};
      loadResource(Resource);
    }

    return Resource;
  }

  function loadResource(resource) {
    var files = fileUtil.scan(ResourceConfig.Location.ROOT);

    resource.scripts = loadScripts(files, ResourceConfig.Location.ROOT, ResourceConfig.Script);
    resource.styleSheets = loadStyleSheets(files, ResourceConfig.Location.ROOT, ResourceConfig.StyleSheet);

    resource.langs = loadLangs(files, ResourceConfig.Location.ROOT, ResourceConfig.Lang);
    resource.templates = loadTemplates(files, ResourceConfig.Location.ROOT, ResourceConfig.Template);

    resource.appPage = loadAppPage(ResourceConfig.Page.APP, ResourceConfig.Location.ROOT, resource);
    resource.loginPage = loadLoginPage(ResourceConfig.Page.LOGIN, ResourceConfig.Location.ROOT, resource);
  }

});
