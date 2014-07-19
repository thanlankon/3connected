/*
 * System          : 3connected
 * Component       : Subject service
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */
define.service('service.Subject', function (service, require, ServiceUtil, Util) {

  var SubjectModel = require('model.Subject');

  service.map = {
    url: '/subject',
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

  service.Model = SubjectModel;

  service.methodConfig = {
    idAttribute: 'subjectId',

    message: {
      entityName: 'subject',
      displayAttribute: 'subjectCode'
    },

    create: {
      attributes: ['subjectCode', 'subjectName', 'numberOfCredits'],
      checkDuplicatedAttributes: ['subjectCode']
    },

    update: {
      attributes: ['subjectCode', 'subjectName', 'numberOfCredits'],
      checkExistanceAttributes: ['subjectId'],
      checkDuplicatedAttributes: ['subjectCode']
    }
  }

});
