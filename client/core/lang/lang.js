define('core.lang.Lang', function (module, require) {

  var LangEngine = require('core.lang.Engine');
  var DateTime = require('constant.DateTime');

  var Lang = {};

  var dfFormat = {
    date: DateTime.Format.DATE
  };

  Lang.get = function (id, data) {

    var LangContainer = window.__Langs;

    if (!LangContainer[id]) {
      throw new Error('Lang not found: ' + id);
    }

    return LangEngine.parse(id, data, dfFormat, LangContainer);
  };

  module.exports = Lang;

});
