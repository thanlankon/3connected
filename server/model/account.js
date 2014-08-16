define.model('model.Account', function (model, ModelUtil, require) {

  var Account = require('model.entity.Account');
  var AuthenticationUtil = require('core.auth.AuthenticationUtil');

  model.Entity = Account;

  model.methodConfig = {
    findAll: {
      buildWhereClause: function (findOptions, options, helpers) {
        if (findOptions.where) {
          findOptions.where[0] += ' AND (accountId > 1)';
        } else {
          findOptions.where = ['accountId > 1'];
        }
      }
    }
  };

  model.resetPassword = function (accountId, password, callback) {
    // encrypt password
    password = AuthenticationUtil.encryptPassword(password);

    Account.find(accountId)
      .success(function (account) {
        if (account == null) {
          // not found
          callback(null, true);
          return;
        }

        account.password = password;

        account.save()
          .success(function (account) {
            // update successfully
            callback(null, false);
          })
          .error(function (error) {
            callback(error);
          });
      })
      .error(function (error) {
        callback(error);
      });
  };

});
