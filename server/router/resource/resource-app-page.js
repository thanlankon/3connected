define('resource.loader.AppPage', function (module, require) {

  module.exports = loadAppPage;

  var fileUtil = require('core.util.FileUtil');
  var handlebars = require('lib.HandleBars');

  var Resource = null;

  // helpers

  handlebars.registerHelper('scripts', function () {
    var scripts = '';

    for (var i in Resource.scripts) {
      scripts += '<script src="resource/' + Resource.scripts[i] + '"></script> \n';
    }

    return new handlebars.SafeString(scripts);
  });

  handlebars.registerHelper('stylesheets', function () {
    var styleSheets = '';

    for (var i in Resource.styleSheets) {
      styleSheets += '<link href="resource/' + Resource.styleSheets[i] + '" rel="stylesheet" type="text/css" /> \n';
    }

    return new handlebars.SafeString(styleSheets);
  });

  handlebars.registerHelper('langs', function (variableName) {
    var langs = variableName + ' = ' + JSON.stringify(Resource.langs);

    langs = '<script>' + langs + '</script>';

    return new handlebars.SafeString(langs);
  });

  handlebars.registerHelper('authentication', function (variableName) {
    var authentication = variableName + ' = ' + JSON.stringify(this.authentication);

    langs = '<script>' + authentication + '</script>';

    return new handlebars.SafeString(langs);
  });

  // loader

  function loadAppPage(location, root, resource) {
    Resource = resource;

    var fileContent = fileUtil.getContent(root, location);

    var appTemplate = handlebars.compile(fileContent);

    return appTemplate;
  }

});
