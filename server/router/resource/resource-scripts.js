define('resource.loader.Scripts', function (module, require) {

  module.exports = loadScripts;

  var fileUtil = require('core.util.FileUtil');

  function loadScripts(files, root, scriptConfig) {
    var scriptFiles = fileUtil.filter(files, scriptConfig.RULES, scriptConfig.EXT);

    return scriptFiles;
  }

});
