define('resource.loader.Templates', function (module, require) {

  module.exports = loadTemplates;

  var fileUtil = require('core.util.FileUtil');

  function loadTemplates(files, root, templateConfig) {
    var templateFiles = fileUtil.filter(files, templateConfig.RULES, templateConfig.EXT);
    var fileContent, contentCursor, templateId, templateContent;

    var templates = {};

    for (var i = 0, len = templateFiles.length; i < len; i++) {
      fileContent = fileUtil.getContent(root, templateFiles[i]);

      while ((contentCursor = fileContent.indexOf('<template id="')) != -1) {
        contentCursor += '<template id="'.length;
        fileContent = fileContent.slice(contentCursor);

        contentCursor = fileContent.indexOf('"');
        if (contentCursor == -1) break;

        templateId = fileContent.substr(0, contentCursor);

        contentCursor += '">'.length;
        fileContent = fileContent.slice(contentCursor);

        contentCursor = fileContent.indexOf('</template>');
        if (contentCursor == -1) break;

        templateContent = fileContent.substr(0, contentCursor);
        //      templateContent = populateLang(templateContent, langs);

        templates[templateId] = templateContent;

        contentCursor += '</template>'.length;
        fileContent = fileContent.slice(contentCursor);
      }
    }

    return templates;
  }

  function populateLang(templateContent, langs) {
    return templateContent;

    //  var beginIndex, endIndex, langId, langContent;
    //
    //  // for {{lang "id"}}
    //
    //  var populatedContent = '';
    //
    //  while ((beginIndex = templateContent.indexOf('{{lang "')) != -1) {
    //    beginIndex += '{{lang "'.length;
    //    endIndex = templateContent.indexOf('"', beginIndex);
    //
    //    langId = templateContent.slice(beginIndex, endIndex);
    //
    //    langContent = langs[langId] || '';
    //
    //    populatedContent += templateContent.slice(0, beginIndex) + langContent;
    //    templateContent = templateContent.slice(endIndex);
    //  }
    //
    //  populatedContent += templateContent;
    //
    //  // for {{lang 'id'}}
    //
    //  templateContent = populatedContent;
    //
    //  var populatedContent = '';
    //
    //  while ((beginIndex = templateContent.indexOf("{{lang '")) != -1) {
    //    beginIndex += "{{lang '".length;
    //    endIndex = templateContent.indexOf("'", beginIndex);
    //
    //    langId = templateContent.slice(beginIndex, endIndex);
    //
    //    langContent = langs[langId] || '';
    //
    //    populatedContent += templateContent.slice(0, beginIndex) + langContent;
    //    templateContent = templateContent.slice(endIndex);
    //  }
    //
    //  populatedContent += templateContent;
    //
    //  return populatedContent.trim();
  }

});
