define('resource.loader.Langs', function (module, require) {

  module.exports = loadLangs;

  var fileUtil = require('core.util.FileUtil');

  function loadLangs(files, root, langConfig) {
    var langFiles = fileUtil.filter(files, langConfig.RULES, langConfig.EXT);
    var fileContent, lines, line, separatorIndex, langId, langContent;

    var langs = {};

    for (var i = 0, len = langFiles.length; i < len; i++) {
      fileContent = fileUtil.getContent(root, langFiles[i]);

      lines = fileContent.split('\n');

      for (var j = 0, lineCount = lines.length; j < lineCount; j++) {
        line = lines[j].trim();

        if (line == '') continue;

        separatorIndex = line.indexOf('=');

        if (separatorIndex == -1) continue;

        langId = line.slice(0, separatorIndex).trim();
        langContent = line.slice(separatorIndex + 1).trim();

        //      langs[langId] = escape(langContent);
        langs[langId] = langContent;
      }
    }

    return langs;
  }

});
