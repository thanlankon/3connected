define.service('service.CategoryOfNews', function (service, require, ServiceUtil, Util) {

  var NewsModel = require('model.News');
  var StaffModel = require('model.Staff');
  var CategoryOfNewsModel = require('model.CategoryOfNews');

  service.map = {
    url: '/categoryOfNews'
  };

  service.Model = CategoryOfNewsModel;

  service.methodConfig = {
    idAttribute: 'categoryOfNewsId',

    message: {
      entityName: 'categoryOfNews',
      displayAttribute: 'categoryOfNewsId'
    },

    findAll: {
      buildFindOptions: function (findOptions, query) {
        findOptions.include = [{
          model: NewsModel,
          as: 'news',
          include: [{
            model: StaffModel,
            as: 'author',
          }]
        }];

        if (query.noContent !== undefined) {
          findOptions.include[0].attributes = ['newsId', 'title', 'authorId', 'createdTime'];
        }
      }
    },
  };

});
