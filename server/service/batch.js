define.service('service.Batch', function (service, require, ServiceUtil, Util) {

  var BatchModel = require('model.Batch');

  service.map = {
    url: '/batch'
  };

  service.Model = BatchModel;

  service.methodConfig = {
    idAttribute: 'batchId',

    message: {
      entityName: 'batch',
      displayAttribute: 'batchName'
    },

    create: {
      attributes: ['batchName'],
      checkDuplicatedAttributes: ['batchName']
    },

    update: {
      attributes: ['batchName'],
      checkExistanceAttributes: ['batchId'],
      checkDuplicatedAttributes: ['batchName']
    }
  }

});
