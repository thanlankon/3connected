/*
 * System          : 3connected
 * Component       : Parent proxy
 * Creator         : UayLU
 * Created date    : 2014/01/07
 */
define.proxy('proxy.Parent', function (proxy, require) {

  proxy.entityId = 'parentId';

  proxy.findAll = 'GET api/parent/findAll';

  proxy.findOne = 'GET api/parent/findOne';

  proxy.create = 'POST api/parent/create';

  proxy.update = 'POST api/parent/update';

  proxy.destroy = 'POST api/parent/destroy';

  // parent entity map
  proxy.EntityMap = [
    {
      name: 'parentId',
      type: 'number'
    },
    {
      name: 'studentId',
      type: 'number'
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
      name: 'relationship',
      type: 'number'
    },
    {
      name: 'gender',
      type: 'number'
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
      name: 'phoneNumber',
      type: 'number'
    }
  ];

});
