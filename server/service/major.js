define.service('service.Major', function (service, require, ServiceUtil, Util) {

  var MajorModel = require('model.Major');

  service.map = {
    url: '/major'
  };

  service.Model = MajorModel;

  service.methodConfig = {
    idAttribute: 'majorId',

    findAll: {
      buildFindOptions: function (findOptions) {
        //        findOptions.include = [{
        //          model: require('model.Class'),
        //          as: 'classes'
        //        }];
      }
    },

    findOne: {
      message: {
        notFound: 'major.find.notFound'
      }
    },

    create: {
      attributes: ['majorName'],
      checkDuplicatedAttributes: ['majorName'],
      message: {
        duplicated: 'major.create.duplicated',
        success: 'major.create.success',
      }
    },

    update: {
      attributes: ['majorName'],
      checkExistanceAttributes: ['majorId'],
      checkDuplicatedAttributes: ['majorName'],
      message: {
        duplicated: 'major.update.duplicated',
        notFound: 'major.update.notFound',
        success: 'major.update.success',
      }
    },

    destroy: {
      message: {
        incomplete: 'major.destroy.incomplete',
        success: 'major.destroy.success',
      }
    }
  }

});
