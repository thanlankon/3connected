define.service('service.Major', function (service, require, ServiceUtil, Util) {

  var MajorModel = require('model.Major');

  service.map = {
    url: '/major'
  };

  service.Model = MajorModel;

  service.methodConfig = {
    idAttribute: 'majorId',

    message: {
      entityName: 'major',
      displayAttribute: 'majorName'
    },

    create: {
      attributes: ['majorName'],
      checkDuplicatedAttributes: ['majorName']
    },

    update: {
      attributes: ['majorName'],
      checkExistanceAttributes: ['majorId'],
      checkDuplicatedAttributes: ['majorName']
    }
  }

});
