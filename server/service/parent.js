/*
 * System          : 3connected
 * Component       : Grade history service
 * Creator         : UayLU
 * Created date    : 2014/07/15
 */
define.service('service.Parent', function (service, require, ServiceUtil, Util) {

  var ParentModel = require('model.Parent');
  var StudentModel = require('model.Student');

  service.map = {
    url: '/parent'
  };

  service.Model = ParentModel;

  service.methodConfig = {
    idAttribute: 'parentId',

    message: {
      entityName: 'parent',
      displayAttribute: 'parent'
    },

    findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: StudentModel,
          as: 'student'
        }];
      }
    },

    create: {
      attributes: ['studentId', 'firstName', 'lastName', 'relationship', 'gender', 'dateOfBirth', 'address', 'email', 'phoneNumber'],
      checkDuplicatedAttributes: ['relationship']
    },

    update: {
      attributes: ['studentId', 'firstName', 'lastName', 'relationship', 'gender', 'dateOfBirth', 'address', 'email', 'phoneNumber'],
      checkExistanceAttributes: ['relationship']
    }
  }

});
