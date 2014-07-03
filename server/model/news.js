define.model('model.News', function (model, ModelUtil, require) {

  var Entity = require('core.model.Entity');
  var News = require('model.entity.News');
  var NewsAttachment = require('model.entity.NewsAttachment');
  var CategoryOfNews = require('model.entity.CategoryOfNews');

  model.Entity = News;

  model.create = function (newsData, callback) {

    var news = {
      title: newsData.title,
      content: newsData.content
    };

    var attachments = newsData.attachments || [];
    var categoryIds = newsData.categoryIds || [];

    Entity.transaction(function (transaction) {

      News.create(news, {
        transaction: transaction
      })
        .success(function (createdNews) {
          createNewsData(createdNews, transaction);
        })
        .error(function (error) {
          transaction.rollback();

          callback(error);
        });

    });

    function createNewsData(news, transaction) {
      console.log('news.newsId', news.newsId);

      var queryChainer = Entity.queryChainer();

      attachments.forEach(function (attachment) {
        attachment.newsId = news.newsId;

        queryChainer.add(NewsAttachment.create(attachment, {
          transaction: transaction
        }));
      });

      categoryIds.forEach(function (categoryId) {
        var categoryOfNews = {
          newsId: news.newsId,
          newsCategoryId: categoryId
        }

        queryChainer.add(CategoryOfNews.create(categoryOfNews, {
          transaction: transaction
        }));
      });

      queryChainer
        .run()
        .success(function (results) {
          transaction.commit();

          callback(null, news);
        })
        .error(function (error) {
          transaction.rollback();

          callback(error);
        });

    }

  };

});
