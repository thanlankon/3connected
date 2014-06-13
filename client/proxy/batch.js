define.proxy('proxy.Batch', function (proxy, require) {

  proxy.entityId = 'batchId';

  proxy.findAll = 'GET api/batch/findAll';

  proxy.findOne = 'GET api/batch/findOne';

  proxy.create = 'POST api/batch/create';

  proxy.update = 'POST api/batch/update';

  proxy.destroy = 'POST api/batch/destroy';

  // batch entity map
  proxy.EntityMap = [
    {
      name: 'batchId',
      type: 'number'
    },
    {
      name: 'batchName',
      type: 'string'
    }
  ];

});
