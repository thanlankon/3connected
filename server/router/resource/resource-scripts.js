define('resource.loader.Scripts', function (module, require) {

  module.exports = loadScripts;

  var fileUtil = require('core.util.FileUtil');
  var Configuration = require('core.config.Configuration').getConfiguration();

  function loadScripts(files, root, scriptConfig) {
    var scriptFiles = fileUtil.filter(files, scriptConfig.RULES, scriptConfig.EXT);

    if (!Configuration.ENABLE_DEVELOPMENT) {

      var libScripts = [];
      var productionScripts = [];

      for (var i = 0, len = scriptFiles.length; i < len; i++) {
        var file = scriptFiles[i];
        if (file.slice(0, 'lib/'.length) == 'lib/') {
          libScripts.push(file);
          continue;
        }

        var fileContent = fileUtil.getContent(root, file);
        productionScripts.push(fileContent);
      }

      productionScripts = productionScripts.join('\r\n\r\n\r\n');

      var productionFile = 'production/scripts.js';

      var path = require('lib.Path');
      var fs = require('lib.FileSystem');

      fs.writeFileSync(path.join(root, productionFile), productionScripts);

      scriptFiles = libScripts.concat(productionFile);

    }

    return scriptFiles;
  }

});
