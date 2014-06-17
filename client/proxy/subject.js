/*
 * System          : 3connected
 * Component       : Subject proxy
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */
define.proxy('proxy.Subject', function (proxy, require) {

  proxy.entityId = 'subjectId';

  proxy.findAll = 'GET api/subject/findAll';

  proxy.findOne = 'GET api/subject/findOne';

  proxy.create = 'POST api/subject/create';

  proxy.update = 'POST api/subject/update';

  proxy.destroy = 'POST api/subject/destroy';

  // subject entity map
  proxy.EntityMap = [
    {
      name: 'subjectId',
      type: 'number'
    },
    {
      name: 'subjectCode',
      type: 'string'
    },
    {
      name: 'subjectName',
      type: 'string'
    },
    {
      name: 'numberOfCredits',
      type: 'number'
    }
  ];

});
