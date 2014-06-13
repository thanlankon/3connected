define.proxy('proxy.Term', function (proxy, require) {

  proxy.entityId = 'termId';

  proxy.findAll = 'GET api/term/findAll';

  proxy.findOne = 'GET api/term/findOne';

  proxy.create = 'POST api/term/create';

  proxy.update = 'POST api/term/update';

  proxy.destroy = 'POST api/term/destroy';

  // term entity map
  proxy.EntityMap = [
    {
      name: 'termId',
      type: 'number'
    },
    {
      name: 'termName',
      type: 'string'
    }
  ];

});
