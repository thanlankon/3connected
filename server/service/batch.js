define.service('service.Batch', function (service, require, ServiceUtil, Util) {

  var BatchModel = require('model.Batch');

  service.map = {
    url: '/batch'
  };

  service.Model = BatchModel;

  service.methodConfig = {
    idAttribute: 'batchId',

    findAll: {
      //      disabled: true
    },

    findOne: {
      message: {
        notFound: 'batch.find.notFound'
      }
    },

    create: {
      attributes: ['batchName'],
      checkDuplicatedAttributes: ['batchName'],
      message: {
        duplicated: 'batch.create.duplicated',
        success: 'batch.create.success',
      }
    },

    update: {
      attributes: ['batchName'],
      checkExistanceAttributes: ['batchId'],
      checkDuplicatedAttributes: ['batchName'],
      message: {
        duplicated: 'batch.update.duplicated',
        notFound: 'batch.update.notFound',
        success: 'batch.update.success',
      }
    },

    destroy: {
      message: {
        incomplete: 'batch.destroy.incomplete',
        success: 'batch.destroy.success',
      }
    }
  }

});
