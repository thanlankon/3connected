define.model('model.Profile', function (model, ModelUtil, require) {

  var Role = require('enum.Role');
  var Staff = require('model.entity.Staff');
  var Student = require('model.entity.Student');
  var Account = require('model.entity.Account');
  var AuthenticationUtil = require('core.auth.AuthenticationUtil');

  model.getSimpleProfile = function (role, userInformationId, callback) {

    if (Role.isStaff(role)) {
      getStaffSimpleProfile(userInformationId, callback);
      return;
    }

    if (Role.isStudentOrParent(role)) {
      getStudentSimpleProfile(userInformationId, callback);
      return;
    }

    // not found
    callback(null, null, true);

    function getStaffSimpleProfile(staffId, callback) {
      Staff.find(staffId)
        .success(function (staff) {
          var profile = null

          if (staff != null) {
            profile = {
              firstName: staff.firstName,
              lastName: staff.lastName,
              username: staff.staffCode,
            };
          }

          callback(null, profile, profile == null);
        })
        .error(function (error) {
          callback(error);
        });
    }

    function getStudentSimpleProfile(studentId, callback) {
      Student.find(studentId)
        .success(function (student) {
          var profile = null

          if (student != null) {
            profile = {
              firstName: student.firstName,
              lastName: student.lastName,
              username: student.studentCode,
            };
          }

          callback(null, profile, profile == null);
        })
        .error(function (error) {
          callback(error);
        });
    }

  };

  model.changePassword = function (accountId, currentPassword, password, callback) {
    // encrypt password
    currentPassword = AuthenticationUtil.encryptPassword(currentPassword);
    password = AuthenticationUtil.encryptPassword(password);

    Account.find(accountId)
      .success(function (account) {
        if (account == null) {
          // not found
          callback(null, null, true, false);
          return;
        }

        if (account.password !== currentPassword) {
          // incorrect password
          callback(null, null, false, true);
          return;
        }

        account.password = password;

        account.save()
          .success(function (account) {
            // update successfully
            callback(null, account, false, false);
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
