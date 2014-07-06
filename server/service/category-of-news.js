define.service('service.CategoryOfNews', function (service, require, ServiceUtil, Util) {

  var News = require('model.News');
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
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: News,
          as: 'news'
        }];
      }
    },
  };

});
