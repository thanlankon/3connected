define.service('service.Class', function (service, require, ServiceUtil, Util) {

  var ClassModel = require('model.Class');
  var BatchModel = require('model.Batch');
  var MajorModel = require('model.Major');

  service.map = {
    url: '/class'
  };

  service.Model = ClassModel;

  service.methodConfig = {
    idAttribute: 'classId',

    findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: BatchModel,
          as: 'batch'
        }, {
          model: MajorModel,
          as: 'major'
        }];
      }
    },

    findOne: {
      message: {
        notFound: 'class.find.notFound'
      }
    },

    create: {
      attributes: ['className', 'batchId', 'majorId'],
      checkDuplicatedAttributes: ['className'],
      message: {
        duplicated: 'class.create.duplicated',
        success: 'class.create.success',
      }
    },

    update: {
      attributes: ['className', 'batchId', 'majorId'],
      checkExistanceAttributes: ['classId'],
      checkDuplicatedAttributes: ['className'],
      message: {
        duplicated: 'class.update.duplicated',
        notFound: 'class.update.notFound',
        success: 'class.update.success',
      }
    },

    destroy: {
      message: {
        incomplete: 'class.destroy.incomplete',
        success: 'class.destroy.success',
      }
    }
  }

});
