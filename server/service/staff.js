/*
 * System          : 3connected
 * Component       : Staff service
 * Creator         : DungNVH
 * Created date    : 2014/06/19
 */
define.service('service.Staff', function (service, require, ServiceUtil, Util) {

  var StaffModel = require('model.Staff');
  var DepartmentModel = require('model.Department');

  service.map = {
    url: '/staff',

    authorize: function (req, authentication, Role, commit) {
      // check for staff
      var authorized = Role.isAdministrator(authentication.accountRole);
      if (authorized) {
        commit(authorized);
        return;
      }

      commit(false);
    },

    methods: {
      findAll: {
        authorize: function (req, authentication, Role, commit) {
          var authorized = Role.isAdministrator(authentication.accountRole);
          if (authorized) {
            commit(authorized);
            return;
          }

          var authorized = Role.isEducator(authentication.accountRole);
          if (authorized) {
            commit(authorized);
            return;
          }
          commit(false);
        }
      }
    }
  };

  service.Model = StaffModel;

  service.methodConfig = {
    idAttribute: 'staffId',

    message: {
      entityName: 'staff',
      displayAttribute: 'firstName'
    },

    findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: DepartmentModel,
          as: 'department'
        }];
      }
    },

    create: {
      attributes: [
        'staffId',
        'staffCode',
        'staffRole',
        'firstName',
        'lastName',
        'gender',
        'dateOfBirth',
        'address',
        'email',
        'departmentId',
        'phoneNumber'
      ],
      checkDuplicatedAttributes: ['staffCode']
    },

    update: {
      attributes: [
        'staffId',
        'firstName',
        'lastName',
        'gender',
        'dateOfBirth',
        'address',
        'email',
        'departmentId',
        'phoneNumber'
      ],
      checkExistanceAttributes: ['staffId'],
      checkDuplicatedAttributes: ['staffCode']
    }
  }

});
