/*
 * System          : 3connected
 * Component       : Course student proxy
 * Creator         : UayLU
 * Created date    : 2014/19/06
 */
define.proxy('proxy.CourseStudent', function (proxy, require) {

  proxy.entityId = 'courseStudentId';

  proxy.findAll = 'GET api/courseStudent/findAll';

  proxy.findOne = 'GET api/courseStudent/findOne';

  proxy.create = 'POST api/courseStudent/create';

  proxy.update = 'POST api/courseStudent/update';

  proxy.destroy = 'POST api/courseStudent/destroy';

  // courseStudent entity map
  proxy.EntityMap = [
    {
      name: 'courseStudentId',
      type: 'number'
    },
    {
      name: 'studentId',
      type: 'string'
    },
    {
      name: 'courseId',
      type: 'string'
    }
  ];

});
