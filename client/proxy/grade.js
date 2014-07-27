/*
 * System          : 3connected
 * Component       : Subject course proxy
 * Creator         : UayLU
 * Created date    : 2014/06/23
 */
define.proxy('proxy.Grade', function (proxy, require) {

  proxy.getCourseGrade = 'GET api/grade/getCourseGrade';

  proxy.updateCourseGrade = 'POST api/grade/updateCourseGrade';

  proxy.getSumaryGrade = 'GET api/grade/getSumaryGrade';

  proxy.statisticGradeStudent = 'GET api/grade/statisticGradeStudent';

  // grade entity map
  proxy.EntityMap = [
    {
      name: 'courseId',
      type: 'number',
      map: 'courseId'
    }, {
      name: 'courseName',
      type: 'string',
      map: 'courseName'
    }, {
      name: 'numberOfCredits',
      type: 'number',
      map: 'numberOfCredits'
    }, {
      name: 'subjectName',
      type: 'string',
      map: 'subjectName'
    }, {
      name: 'finalSubjectGrade',
      type: 'string',
      map: 'finalSubjectGrade'
    }, {
      name: 'resultSubject',
      type: 'string',
      map: 'resultSubject'
    }, {
      name: 'statistic',
      type: 'string',
      map: 'statistic'
    }
  ];




});
