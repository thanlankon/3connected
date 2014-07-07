/*
 * System          : 3connected
 * Component       : Student course proxy
 * Creator         : ThanhVM
 * Modifier        : TrongND
 */

define.proxy('proxy.student.CourseOfStudent', function (proxy, require) {

  proxy.entityId = 'courseId';

  proxy.getCourseGrade = 'GET api/student/course/getCourseGrade';

  // course entity map
  proxy.CourseGradeEntityMap = [
    {
      name: 'gradeCategoryName',
      type: 'string'
    }, {
      name: 'gradeCategoryCode',
      type: 'string'
    }, {
      name: 'weight',
      type: 'number'
    }, {
      name: 'value',
      type: 'number'
    }
  ];

});
