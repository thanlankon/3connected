define.service('service.Class', function (service, require, ServiceUtil, Util) {

  var ClassModel = require('model.Class');
  var BatchModel = require('model.Batch');
  var MajorModel = require('model.Major');

  service.map = {
    url: '/class',

    methods: {
      addStudents: {
        url: '/addStudents',
        httpMethod: 'POST'
      },
      removeStudents: {
        url: '/removeStudents',
        httpMethod: 'POST'
      }
    }
  };

  service.Model = ClassModel;

  service.methodConfig = {
    idAttribute: 'classId',

    message: {
      entityName: 'class',
      displayAttribute: 'className'
    },

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

    create: {
      attributes: ['className', 'batchId', 'majorId'],
      checkDuplicatedAttributes: ['className']
    },

    update: {
      attributes: ['className', 'batchId', 'majorId'],
      checkExistanceAttributes: ['classId'],
      checkDuplicatedAttributes: ['className']
    }
  };

  // for class students

  service.addStudents = function (req, res) {
    ServiceUtil.sendServiceResponse(res, null, 'class', null);
  };

  service.removeStudents = function (req, res) {
    ServiceUtil.sendServiceResponse(res, null, 'student', null);
  };

});
