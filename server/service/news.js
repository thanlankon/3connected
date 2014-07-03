define.service('service.News', function (service, require, ServiceUtil, Util) {

  var NewsModel = require('model.News');

  service.map = {
    url: '/news'
  };

  service.Model = NewsModel;

  service.methodConfig = {
    idAttribute: 'newsId',

    message: {
      entityName: 'news',
      displayAttribute: 'newsTitle'
    },

    findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          entity: require('model.entity.CategoryOfNews'),
          as: 'categories'
        }];

        //findOptions.attributes = ['newsId', 'title', 'createdTime'];
      }
    },
  };

  service.create = function (req, res) {

    var newsData = Util.Object.pick(req.body, ['title', 'content', 'categoryIds', 'attachments']);

    var serviceResponse = {
      message: null,
      error: null,
      data: null
    };

    NewsModel.create(newsData, function (error, createdNews) {
      if (error) {
        serviceResponse.message = 'news.create.error.unknown';

        serviceResponse.error = error;
      } else {
        serviceResponse.message = 'news.create.success';

        serviceResponse.data = createdNews;
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  };

});
