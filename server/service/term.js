define.service('service.Term', function (service, require, ServiceUtil, Util) {

  var TermModel = require('model.Term');

  service.map = {
    url: '/term'
  };

  service.Model = TermModel;

  service.methodConfig = {
    idAttribute: 'termId',

    message: {
      entityName: 'term',
      displayAttribute: 'termName'
    },

    create: {
      attributes: ['termName'],
      checkDuplicatedAttributes: ['termName']
    },

    update: {
      attributes: ['termName'],
      checkExistanceAttributes: ['termId'],
      checkDuplicatedAttributes: ['termName']
    }
  }

});
