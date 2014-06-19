/*
 * System          : 3connected
 * Component       : Subject version service
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */
define.service('service.SubjectVersion', function (service, require, ServiceUtil, Util) {

  var SubjectVersionModel = require('model.SubjectVersion');
  var SubjectModel = require('model.Subject');

  service.map = {
    url: '/subjectVersion'
  };

  service.Model = SubjectVersionModel;

  service.methodConfig = {
    idAttribute: 'subjectVersionId',

    message: {
      entityName: 'subjectVersion',
      displayAttribute: 'description'
    },

    findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: SubjectModel,
          as: 'subject'
        }];
      }
    }
  }

});