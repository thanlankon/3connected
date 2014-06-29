define.service('service.NewsCategory', function (service, require, ServiceUtil, Util) {

  var NewsCategoryModel = require('model.NewsCategory');

  service.map = {
    url: '/newsCategory'
  };

  service.Model = NewsCategoryModel;

  service.methodConfig = {
    idAttribute: 'newsCategoryId',

    message: {
      entityName: 'newsCategory',
      displayAttribute: 'newsCategoryName'
    },

    create: {
      attributes: ['newsCategoryName'],
      checkDuplicatedAttributes: ['newsCategoryName']
    },

    update: {
      attributes: ['newsCategoryName'],
      checkExistanceAttributes: ['newsCategoryId'],
      checkDuplicatedAttributes: ['newsCategoryName']
    }
  }

});
