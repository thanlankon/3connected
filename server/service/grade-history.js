/*
 * System          : 3connected
 * Component       : Grade history service
 * Creator         : UayLU
 * Created date    : 2014/01/07
 */
define.service('service.GradeHistory', function (service, require, ServiceUtil, Util) {

  var GradeModel = require('model.Grade');
  var GradeHistotyModel = require('model.GradeHistory');
  var CourseModel = require('model.Course');
  var TermModel = require('model.Term');
  var MajorModel = require('model.Major');

  service.map = {
    url: '/gradeHistory'
  };

  service.Model = GradeHistotyModel;

  service.methodConfig = {
    idAttribute: 'gradeHistoryId',

    message: {
      entityName: 'gradeHistory',
      displayAttribute: 'gradeHistory'
    },

    findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: GradeModel,
          as: 'grade',
          include: [{
            model: CourseModel,
            as: 'course',
            include: [{
              model: TermModel,
              as: 'term'
              }, {
              model: MajorModel,
              as: 'major'
              }]
            }]
        }];
      }
    }
  }

});