/*
 * System          : 3connected
 * Component       : Grade history proxy
 * Creator         : UayLU
 * Created date    : 2014/01/07
 */
define.proxy('proxy.GradeHistory', function (proxy, require) {

  proxy.entityId = 'GradeHistoryId';

  proxy.findAll = 'GET api/gradeHistory/findAll';

  proxy.findOne = 'GET api/gradeHistory/findOne';

  // attendance history entity map
  proxy.EntityMap = [
    {
      name: 'gradeHistoryId',
      type: 'number'
    },
    {
      name: 'oldValue',
      type: 'number'
    },
    {
      name: 'newValue',
      type: 'number'
    },
    {
      name: 'time',
      type: 'string'
    }, {
      name: 'gradeId',
      type: 'number'
    }, {
      name: 'staffId',
      type: 'number'
    }, {
      name: 'courseId',
      type: 'number',
      map: 'grade.course.courseId'
    }, {
      name: 'courseName',
      type: 'number',
      map: 'grade.course.courseName'
    }, {
      name: 'termName',
      type: 'number',
      map: 'grade.course.term.termName'
    }, {
      name: 'majorName',
      type: 'number',
      map: 'grade.course.major.majorName'
    }
  ];

});