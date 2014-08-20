define.proxy('proxy.Student', function (proxy, require) {

  proxy.entityId = 'studentId';

  proxy.findAll = 'GET api/student/findAll';

  proxy.findOne = 'GET api/student/findOne';

  proxy.create = 'POST api/student/create';

  proxy.update = 'POST api/student/update';

  proxy.destroy = 'POST api/student/destroy';

  proxy.importStudent = 'POST api/student/import';

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
      type: 'string'
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
    {
      name: 'batchName',
      type: 'string',
      map: 'class.batch.batchName'
    }, {
      name: 'majorName',
      type: 'string',
      map: 'class.major.majorName'
    }, {
      name: 'phoneNumber',
      type: 'number'
    }

  ];

});
