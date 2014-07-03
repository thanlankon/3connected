define.proxy('proxy.Account', function (proxy, require) {

  proxy.entityId = 'accountId';

  proxy.findAll = 'GET api/account/findAll';

  proxy.findOne = 'GET api/account/findOne';

  proxy.create = 'POST api/account/create';

  proxy.update = 'POST api/account/update';

  proxy.destroy = 'POST api/account/destroy';

  // batch entity map
  proxy.EntityMap = [
    {
      name: 'accountId',
      type: 'number'
    },
    {
      name: 'username',
      type: 'string'
    },
    {
      name: 'password',
      type: 'string'
    },
    {
      name: 'role',
      type: 'string'
    },
    {
      name: 'userInformationId',
      type: 'string'
    },
    {
      name: 'isActive',
      type: 'string'
    },
    {
      name: 'expiredDate',
      type: 'string'
    }
  ];

});
