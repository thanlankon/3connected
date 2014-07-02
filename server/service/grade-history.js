/*
 * System          : 3connected
 * Component       : Grade history service
 * Creator         : UayLU
 * Created date    : 2014/01/07
 */
define.service('service.GradeHistory', function (service, require, ServiceUtil, Util) {

  var GradeHistoryModel = require('model.GradeHistory');

  service.map = {
    url: '/gradeHistory'
  };

  service.Model = GradeHistoryModel;

  service.methodConfig = {
    idAttribute: 'gradeHistoryId',

    message: {
      entityName: 'gradeHistory',
      displayAttribute: 'gradeHistory'
    }
  }

});
