define.proxy('proxy.Major', function (proxy, require) {

  proxy.entityId = 'majorId';

  proxy.findAll = 'GET api/major/findAll';

  proxy.findOne = 'GET api/major/findOne';

  proxy.create = 'POST api/major/create';

  proxy.update = 'POST api/major/update';

  proxy.destroy = 'POST api/major/destroy';

  // major entity map
  proxy.EntityMap = [
    {
      name: 'majorId',
      type: 'number'
    },
    {
      name: 'majorName',
      type: 'string'
    }
  ];

});
