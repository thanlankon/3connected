define('constant.Account', function (module, require) {

  var AccountConstant = {
    ADMINISTRATOR_USERNAME: 'Administrator',

    isAdministratorUsername: function (username) {
      return (username + '').trim().toLowerCase() === AccountConstant.ADMINISTRATOR_USERNAME.toLowerCase();
    }
  };

  module.exports = AccountConstant;

});
