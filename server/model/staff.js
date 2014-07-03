define.model('model.Staff', function (model, ModelUtil, require) {

  var Entity = require('core.model.Entity');
  var Staff = require('model.entity.Staff');
  var Account = require('model.entity.Account');
  var Util = require('core.util.Util');
  var ConvertUtil = require('core.util.ConvertUtil');
  var AccountConfig = require('config.Account');

  model.Entity = Staff;

  model.create = function (entityData, checkStaffDuplicated, callback) {

    var staffData = Util.Object.omit(entityData, ['staffRole']);

    Entity.transaction(function (transaction) {

      Staff.findOrCreate(checkStaffDuplicated, staffData, {
        transaction: transaction
      })
        .success(function (createdStaff, created) {

          if (!created) {
            transaction.rollback();

            callback(null, createdStaff, true);
          } else {
            createAccounts(createdStaff, transaction);
          }
        })
        .error(function (error) {
          transaction.rollback();

          callback(error);
        });

    });

    function createAccounts(createdStaff, transaction) {
      var username = createdStaff.staffCode;
      var defaultPassword = AccountConfig.DEFAULT_PASSWORD;
      // expired date
      var currentDate = new Date();
      var defaultExpiredYear = AccountConfig.DEFAULT_EXPIRED_YEAR;
      var defaultExpiredDate = new Date(currentDate.getFullYear() + defaultExpiredYear,
        currentDate.getMonth(), currentDate.getDate());
      var expiredDate = ConvertUtil.DateTime.formatDate(defaultExpiredDate);

      var staffAccount = {
        username: username,
        role: entityData.staffRole,
        password: defaultPassword,
        userInformationId: createdStaff.staffId,
        isActive: true,
        expiredDate: expiredDate
      };

      var checkStaffAccountDupplicate = {
        username: username
      };

      Account.findOrCreate(checkStaffAccountDupplicate, staffAccount, {
        transaction: transaction
      })
        .success(function (createdAccount, created) {

          if (!created) {
            transaction.rollback();

            callback(null, createdStaff, true);
          } else {
            transaction.commit();

            callback(null, createdStaff, false);
          }
        })
        .error(function (error) {
          transaction.rollback();

          callback(error);
        });
    }

  };

});
