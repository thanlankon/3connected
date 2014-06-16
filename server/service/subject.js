define.service('service.Subject', function (service, require, ServiceUtil, Util) {

  var SubjectModel = require('model.Subject');

  service.map = {
    url: '/subject'
  };

  service.Model = SubjectModel;

  service.methodConfig = {
    idAttribute: 'subjectId',

    message: {
      entityName: 'subject',
      displayAttribute: 'subjectCode'
    },

    create: {
      attributes: ['subjectCode','subjectName','numberOfCredits'],
      checkDuplicatedAttributes: ['subjectCode']
    },

    update: {
      attributes: ['subjectCode','subjectName','numberOfCredits'],
      checkExistanceAttributes: ['subjectId'],
      checkDuplicatedAttributes: ['subjectCode']
    }
  }

});
