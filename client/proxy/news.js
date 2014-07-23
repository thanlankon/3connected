define.proxy('proxy.News', function (proxy, require) {

  proxy.entityId = 'newsId';

  proxy.findAll = 'GET api/news/findAll';

  proxy.findOne = 'GET api/news/findOne';

  proxy.create = 'POST api/news/create';

  proxy.update = 'POST api/news/update';

  proxy.destroy = 'POST api/news/destroy';

  proxy.downloadAttachment = 'GET api/attachment/download';

  // news entity map
  proxy.EntityMap = [
    {
      name: 'newsId',
      type: 'number'
    },
    {
      name: 'title',
      type: 'string'
    },
    {
      name: 'author',
      type: 'string',
      map: 'author.staffCode'
    },
    {
      name: 'createdTime',
      type: 'date'
    }
  ];

});
