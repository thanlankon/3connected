//ThanhVMSE90059
//UayLUSE90014
define.proxy('proxy.Department', function (proxy, require) {

  proxy.entityId = 'departmentId';

  proxy.findAll = 'GET api/department/findAll';

  proxy.findOne = 'GET api/department/findOne';

  proxy.create = 'POST api/department/create';

  proxy.update = 'POST api/department/update';

  proxy.destroy = 'POST api/department/destroy';

  // department entity map
  proxy.EntityMap = [
    {
      name: 'departmentId',
      type: 'number'
    },
    {
      name: 'departmentName',
      type: 'string'
    }
  ];

});
