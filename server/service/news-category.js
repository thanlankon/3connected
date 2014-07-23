define.service('service.NewsCategory', function (service, require, ServiceUtil, Util) {

  var NewsCategoryModel = require('model.NewsCategory');

  service.map = {
    url: '/newsCategory',

    methods: {
      getCourseAttendance: {
        url: '/getNewsCategory',
        httpMethod: 'GET'
      }
    }
  };

  service.Model = NewsCategoryModel;

  service.methodConfig = {
    idAttribute: 'newsCategoryId',

    message: {
      entityName: 'newsCategory',
      displayAttribute: 'newsCategoryName'
    },

    findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: NewsCategoryModel,
          as: 'parentCategory'
        }];
      }
    },

    findOne: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: NewsCategoryModel,
          as: 'parentCategory'
        }];
      }
    },

    create: {
      attributes: ['newsCategoryName', 'parentCategoryId'],
      checkDuplicatedAttributes: ['newsCategoryName']
    },

    update: {
      attributes: ['newsCategoryName'],
      checkExistanceAttributes: ['newsCategoryId'],
      checkDuplicatedAttributes: ['newsCategoryName']
    }
  };

  service.getNewsCategory = function (req, res) {

    var serviceResponse = {
      error: null,
      message: null,
      data: null
    };

  };

});
