define('core.view.helpers.text.GenderTextHelper', function (module, require) {

  var View = require('core.view.View');
  var Util = require('core.util.Util');
  var ConvertUtil = require('core.util.ConvertUtil');

  View.registerHelper('text.gender', genderTextHelper);

  function genderTextHelper(gender) {
    gender = Util.value(gender);

    gender = ConvertUtil.Gender.toString(gender);

    return View.safeString(gender);
  }

});
