define.service('service.News', function (service, require, ServiceUtil, Util) {

  var NewsModel = require('model.News');

  service.map = {
    url: '/news',
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
          entity: require('model.entity.Staff'),
          as: 'author'
        }];

        //findOptions.attributes = ['newsId', 'title', 'createdTime'];
      }
    },

    findOne: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          entity: require('model.entity.CategoryOfNews'),
          as: 'categories',
          include: [{
            entity: require('model.entity.NewsCategory'),
            as: 'newsCategory'
          }]
        }, {
          entity: require('model.entity.NewsAttachment'),
          as: 'attachments',
          attributes: ['name', 'extension', 'size']
        }];

        findOptions.attributes = ['newsId', 'title', 'content', 'createdTime'];
      }
    },

    create: {
      authorize: function (req, authentication, Role, commit) {
        // check for staff
        var authorized = Role.isStaff(authentication.accountRole);
        commit(authorized);
      }
    }
  };

  service.create = function (req, res) {

    var authorId = req.authentication.userInformationId;

    var newsData = Util.Object.pick(req.body, ['title', 'content', 'categoryIds', 'attachments']);

    var serviceResponse = {
      message: null,
      error: null,
      data: null
    };

    NewsModel.create(authorId, newsData, function (error, createdNews) {
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

  service.destroy = function (req, res) {

    var newsId = req.body.newsId;

    var serviceResponse = {
      message: null,
      error: null
    };

    NewsModel.destroy(newsId, function (error) {
      if (error) {
        serviceResponse.message = 'news.destroy.error.unknown';

        serviceResponse.error = error;
      } else {
        serviceResponse.message = 'news.destroy.success';
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message);
    });

  };

});
