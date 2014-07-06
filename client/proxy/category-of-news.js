define.proxy('proxy.CategoryOfNews', function (proxy, require) {

  proxy.entityId = 'newsId';

  proxy.findAll = 'GET api/categoryOfNews/findAll';

  // news entity map
  proxy.EntityMap = [
    {
      name: 'newsId',
      type: 'number',
      map: 'news.newsId'
    },
    {
      name: 'title',
      type: 'string',
      map: 'news.title'
    },
    {
      name: 'createdTime',
      type: 'date',
      map: 'news.createdTime'
    }
  ];

});
