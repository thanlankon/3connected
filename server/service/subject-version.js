/*
 * System          : 3connected
 * Component       : Subject version service
 * Creator         : VyBD
 * Modifier        :ThanhVM
 * Created date    : 2014/16/06
 */
define.service('service.SubjectVersion', function (service, require, ServiceUtil, Util) {

  var SubjectVersionModel = require('model.SubjectVersion');
  var SubjectModel = require('model.Subject');

  service.map = {
    url: '/subjectVersion',
    authorize: function (req, authentication, Role, commit) {
      // check for staff
      var authorized = Role.isEducator(authentication.accountRole);
      if (authorized) {
        commit(authorized);
        return;
      }

      commit(false);
    }
  };

  service.Model = SubjectVersionModel;

  service.methodConfig = {
    idAttribute: 'subjectVersionId',

    message: {
      entityName: 'subjectVersion',
      displayAttribute: 'description'
    },

    findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: SubjectModel,
          as: 'subject'
        }];
      }
    },

    create: {
      attributes: ['subjectId', 'description'],
      checkDuplicatedAttributes: ['subjectId', 'description']
    },

    update: {
      attributes: ['subjectId', 'description'],
      checkDuplicatedAttributes: ['subjectId', 'description'],
      checkExistanceAttributes: ['subjectVersionId']
    },

    findOne: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: SubjectModel,
          as: 'subject'
         }];
      }
    }
  };

});
