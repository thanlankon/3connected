define.model('model.Student', function (model, ModelUtil, require) {

  var Entity = require('core.model.Entity');
  var Student = require('model.entity.Student');
  var Account = require('model.entity.Account');
  var Util = require('core.util.Util');
  var ConvertUtil = require('core.util.ConvertUtil');
  var AccountConfig = require('config.Account');
  var Role = require('enum.Role');
  var AuthenticationUtil = require('core.auth.AuthenticationUtil');

  model.Entity = Student;

  model.create = function (entityData, checkStudentDuplicated, callback) {

    var studentData = entityData;

    Entity.transaction(function (transaction) {

      Student.findOrCreate(checkStudentDuplicated, studentData, {
        transaction: transaction
      })
        .success(function (createdStudent, created) {

          if (!created) {
            transaction.rollback();

            callback(null, createdStudent, true);
          } else {
            createStudentAccount(createdStudent, transaction);
          }
        })
        .error(function (error) {
          transaction.rollback();

          callback(error);
        });

    });

    function createStudentAccount(createdStudent, transaction) {
      var username = createdStudent.studentCode;
      var defaultPassword = AuthenticationUtil.encryptPassword(AccountConfig.DEFAULT_PASSWORD);
      // expired date
      var currentDate = new Date();
      var defaultExpiredYear = AccountConfig.DEFAULT_EXPIRED_YEAR;
      var defaultExpiredDate = new Date(currentDate.getFullYear() + defaultExpiredYear,
        currentDate.getMonth(), currentDate.getDate());
      var expiredDate = ConvertUtil.DateTime.formatDate(defaultExpiredDate);

      var studentAccount = {
        username: username,
        role: Role.STUDENT,
        password: defaultPassword,
        userInformationId: createdStudent.studentId,
        isActive: true,
        expiredDate: expiredDate
      };

      var checkStudentAccountDupplicate = {
        username: username,
        role: Role.STUDENT
      };

      Account.findOrCreate(checkStudentAccountDupplicate, studentAccount, {
        transaction: transaction
      })
        .success(function (createdAccount, created) {

          if (!created) {
            transaction.rollback();

            callback(null, createdStudent, true);
          } else {
            createParentAccount(createdStudent, transaction);
          }
        })
        .error(function (error) {
          transaction.rollback();

          callback(error);
        });
    }

    function createParentAccount(createdStudent, transaction) {
      var username = createdStudent.studentCode;
      var defaultPassword = AuthenticationUtil.encryptPassword(AccountConfig.DEFAULT_PASSWORD);
      // expired date
      var currentDate = new Date();
      var defaultExpiredYear = AccountConfig.DEFAULT_EXPIRED_YEAR;
      var defaultExpiredDate = new Date(currentDate.getFullYear() + defaultExpiredYear,
        currentDate.getMonth(), currentDate.getDate());
      var expiredDate = ConvertUtil.DateTime.formatDate(defaultExpiredDate);

      var parentAccount = {
        username: username,
        role: Role.PARENT,
        password: defaultPassword,
        userInformationId: createdStudent.studentId,
        isActive: true,
        expiredDate: expiredDate
      };

      var checkParentAccountDupplicate = {
        username: username,
        role: Role.PARENT
      };

      Account.findOrCreate(checkParentAccountDupplicate, parentAccount, {
        transaction: transaction
      })
        .success(function (createdAccount, created) {

          if (!created) {
            transaction.rollback();

            callback(null, createdStudent, true);
          } else {
            transaction.commit();

            callback(null, createdStudent, false);
          }
        })
        .error(function (error) {
          transaction.rollback();

          callback(error);
        });
    }

  };

});
