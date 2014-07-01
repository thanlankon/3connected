define.proxy('proxy.NewsCategory', function (proxy, require) {

  proxy.entityId = 'newsCategoryId';

  proxy.findAll = 'GET api/newsCategory/findAll';

  proxy.findOne = 'GET api/newsCategory/findOne';

  proxy.create = 'POST api/newsCategory/create';

  proxy.update = 'POST api/newsCategory/update';

  proxy.destroy = 'POST api/newsCategory/destroy';

  // newsCategory entity map
  proxy.EntityMap = [
    {
      name: 'newsCategoryId',
      type: 'number'
    },
    {
      name: 'newsCategoryName',
      type: 'string'
    },
    {
      name: 'parentCategoryId',
      type: 'string'
    },
    {
      name: 'parentCategoryName',
      type: 'string',
      map: 'parentCategory.newsCategoryName'
    }
  ];

});
