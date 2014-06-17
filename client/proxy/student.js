define.proxy('proxy.Student', function (proxy, require) {

  proxy.entityId = 'studentId';

  proxy.findAll = 'GET api/student/findAll';

  proxy.findOne = 'GET api/student/findOne';

  proxy.create = 'POST api/student/create';

  proxy.update = 'POST api/student/update';

  proxy.destroy = 'POST api/student/destroy';

  // student entity map
  proxy.EntityMap = [
    {
      name: 'studentId',
      type: 'number'
    },
    {
      name: 'studentCode',
      type: 'string'
    },
    {
      name: 'firstName',
      type: 'string'
    },
    {
      name: 'lastName',
      type: 'string'
    },
    {
      name: 'gender',
      type: 'number'
    },
    {
      name: 'dateOfBirth',
      type: 'date'
    },
    {
      name: 'address',
      type: 'string'
    },
    {
      name: 'email',
      type: 'string'
    },
    {
      name: 'classId',
      type: 'string'
    },
    {
      name: 'className',
      type: 'string',
      map: 'class.className'
    },

  ];

});
