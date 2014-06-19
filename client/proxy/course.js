/*
 * System          : 3connected
 * Component       : Subject version proxy
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */
define.proxy('proxy.Course', function (proxy, require) {

  proxy.entityId = 'courseId';

  proxy.findAll = 'GET api/course/findAll';

  proxy.findOne = 'GET api/course/findOne';

  proxy.create = 'POST api/course/create';

  proxy.update = 'POST api/course/update';

  proxy.destroy = 'POST api/course/destroy';

  // course entity map
  proxy.EntityMap = [
    {
      name: 'courseId',
      type: 'number'
    }, {
      name: 'courseName',
      type: 'string'
    }, {
      name: 'numberOfCredits',
      type: 'string'
    }, {
      name: 'className',
      type: 'string',
      map: 'class.className'
    }, {
      name: 'termName',
      type: 'string',
      map: 'term.termName'
    }, {
      name: 'majorName',
      type: 'string',
      map: 'major.majorName'
    }, {
      name: 'subjectName',
      type: 'string',
      map: 'subjectVersion.subject.subjectName'
    }, {
      name: 'description',
      type: 'string',
      map: 'subjectVersion.description'
    }
  ];

});