define('resource.loader.StyleSheets', function (module, require) {

  module.exports = loadStyleSheets;

  var fileUtil = require('core.util.FileUtil');

  function loadStyleSheets(files, root, styleSheetConfig) {
    var styleSheetFiles = fileUtil.filter(files, styleSheetConfig.RULES, styleSheetConfig.EXT);

    return styleSheetFiles;
  }

});
