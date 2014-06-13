define.service('service.Term', function (service, require, ServiceUtil, Util) {

  var TermModel = require('model.Term');
  var Util = require('core.util.Util');

  service.map = {
    url: '/term'
  };

  service.Model = TermModel;

  service.methodConfig = {
    idAttribute: 'termId',

    findAll: {
      //      disabled: true
    },

    findOne: {
      message: {
        notFound: 'term.find.notFound'
      }
    },

    create: {
      attributes: ['termName'],
      checkDuplicatedAttributes: ['termName'],
      message: {
        duplicated: 'term.create.duplicated',
        success: 'term.create.success',
      }
    },

    update: {
      attributes: ['termName'],
      checkExistanceAttributes: ['termId'],
      checkDuplicatedAttributes: ['termName'],
      message: {
        duplicated: 'term.update.duplicated',
        notFound: 'term.update.notFound',
        success: 'term.update.success',
      }
    },

    destroy: {
      message: {
        incomplete: 'term.destroy.incomplete',
        success: 'term.destroy.success',
      }
    }
  }

});
