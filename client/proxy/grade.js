/*
 * System          : 3connected
 * Component       : Subject course proxy
 * Creator         : UayLU
 * Created date    : 2014/06/23
 */
define.proxy('proxy.Grade', function (proxy, require) {

  proxy.getCourseGrade = 'GET api/grade/getCourseGrade';

  proxy.updateCourseGrade = 'POST api/grade/updateCourseGrade';

  proxy.getSumaryGrade = 'POST api/grade/getSumaryGrade';


});
