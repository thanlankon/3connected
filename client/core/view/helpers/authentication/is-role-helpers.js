define('core.view.helpers.authentication.IsAdministratorAuthenticationHelper', function (module, require) {

  var View = require('core.view.View');
  var Util = require('core.util.Util');
  var ConvertUtil = require('core.util.ConvertUtil');
  var Role = require('enum.Role');

  registerIsRoleHelper('Administrator');
  registerIsRoleHelper('Educator');
  registerIsRoleHelper('Examinator');
  registerIsRoleHelper('NewsManager');
  registerIsRoleHelper('Student');
  registerIsRoleHelper('Parent');
  registerIsRoleHelper('Staff');
  registerIsRoleHelper('StudentOrParent');

  function registerIsRoleHelper(role) {
    View.registerHelper('auth.is' + role, isRoleHelper);

    function isRoleHelper(options) {
      var authentication = __Authentication;

      if (Role['is' + role](authentication.accountRole)) {
        return options.fn(options.contexts || this);
      }
    }
  }

});
