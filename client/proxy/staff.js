define.proxy('proxy.Staff', function (proxy, require) {

  proxy.entityId = 'staffId';

  proxy.findAll = 'GET api/staff/findAll';

  proxy.findOne = 'GET api/staff/findOne';

  proxy.create = 'POST api/staff/create';

  proxy.update = 'POST api/staff/update';

  proxy.destroy = 'POST api/staff/destroy';

  // staff entity map
  proxy.EntityMap = [
    {
      name: 'staffId',
      type: 'number'
    },
    {
      name: 'staffCode',
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
      name: 'departmentId',
      type: 'string'
    },
    {
      name: 'departmentName',
      type: 'string',
      map: 'department.departmentName'
    }, {
      name: 'phoneNumber',
      type: 'number'
    }

  ];

});
