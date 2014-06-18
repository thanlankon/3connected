/*
 * System          : 3connected
 * Component       : Subject version proxy
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */
define.proxy('proxy.SubjectVersion', function (proxy, require) {

  proxy.entityId = 'subjectVersionId';

  proxy.findAll = 'GET api/subjectVersion/findAll';

  proxy.findOne = 'GET api/subjectVersion/findOne';

  proxy.create = 'POST api/subjectVersion/create';

  proxy.update = 'POST api/subjectVersion/update';

  proxy.destroy = 'POST api/subjectVersion/destroy';

  // subjectVersion entity map
  proxy.EntityMap = [
    {
      name: 'subjectVersionId',
      type: 'number'
    },
    {
      name: 'subjectName',
      type: 'string',
      map: 'subject.subjectName'
    },
    {
      name: 'description',
      type: 'string'
    }
  ];

});
