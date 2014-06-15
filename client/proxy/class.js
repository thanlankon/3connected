define.proxy('proxy.Class', function (proxy, require) {

  proxy.entityId = 'classId';

  proxy.findAll = 'GET api/class/findAll';

  proxy.findOne = 'GET api/class/findOne';

  proxy.create = 'POST api/class/create';

  proxy.update = 'POST api/class/update';

  proxy.destroy = 'POST api/class/destroy';

  // class entity map
  proxy.EntityMap = [
    {
      name: 'classId',
      type: 'number'
    },
    {
      name: 'className',
      type: 'string'
    },
    {
      name: 'batchId',
      type: 'int'
    },
    {
      name: 'batchName',
      type: 'string',
      map: 'batch.batchName'
    },
    {
      name: 'majorId',
      type: 'int'
    },
    {
      name: 'majorName',
      type: 'string',
      map: 'major.majorName'
    }
  ];

});
