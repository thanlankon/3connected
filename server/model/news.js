define.model('model.News', function (model, ModelUtil, require) {

  var Util = require('core.util.Util');
  var Entity = require('core.model.Entity');
  var News = require('model.entity.News');
  var NewsAttachment = require('model.entity.NewsAttachment');
  var CategoryOfNews = require('model.entity.CategoryOfNews');
  var ConvertUtil = require('core.util.ConvertUtil');
  var Configuration = require('core.config.Configuration').getConfiguration();

  var path = require('lib.Path');
  var fs = require('lib.FileSystem');

  var serverId = Configuration.ServerId;
  var fileDirectory = Configuration.File.LOCATION;

  model.Entity = News;

  model.create = function (authorId, newsData, callback) {

    var news = {
      title: newsData.title,
      //content: newsData.content,
      authorId: authorId,
      serverId: serverId
    };

    var attachments = newsData.attachments || [];
    var categoryIds = newsData.categoryIds || [];

    Entity.transaction(function (transaction) {

      News.create(news, {
        transaction: transaction
      })
        .success(function (createdNews) {
          var file = path.join(fileDirectory, 'news', '' + createdNews.newsId);

          fs.writeFileSync(file, newsData.content);

          createNewsData(createdNews, transaction);
        })
        .error(function (error) {
          transaction.rollback();

          callback(error);
        });

    });

    function createNewsData(news, transaction) {

      var queryChainer = Entity.queryChainer();

      attachments.forEach(function (attachment) {
        attachment.newsId = news.newsId;
        attachment = Util.Object.omit(attachment, ['data']);

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
          for (var i = 0, len = attachments.length; i < len; i++) {
            var blob = ConvertUtil.Blob.fromBase64(attachments[i].data);

            var file = path.join(fileDirectory, 'attachments', '' + results[i].attachmentId);

            fs.writeFileSync(file, blob);
          }

          transaction.commit();

          callback(null, news);
        })
        .error(function (error) {
          transaction.rollback();

          callback(error);
        });

    }

  };

  model.update = function (authorId, newsData, callback) {

    var newsId = newsData.newsId;

    Entity.transaction(function (transaction) {
      News.find({
        newsId: newsId,
        serverId: serverId,
        authorId: authorId
      }, {
        transaction: transaction
      })
        .success(function (foundNews) {
          if (!foundNews) {
            callback(null, true);
            return;
          }

          foundNews.updateAttributes({
            title: newsData.title
          }, {
            transaction: transaction
          })
            .success(function () {
              updateNewsData(transaction);
            })
            .error(function (error) {
              transaction.rollback();
              callback(error);
            });
        })
        .error(function (error) {
          transaction.rollback();
          callback(error);
        });
    });

    function updateNewsData(transaction) {
      var attachments = newsData.attachments || [];
      var categoryIds = newsData.categoryIds || [];
      var deletedAttachments = newsData.deletedAttachments || [];

      var destroyQueryChainer = Entity.queryChainer();

      destroyQueryChainer
        .add(CategoryOfNews.destroy({
          newsId: newsId
        }, {
          transaction: transaction
        }))
        .add(NewsAttachment.destroy({
          attachmentId: deletedAttachments
        }, {
          transaction: transaction
        }));

      destroyQueryChainer
        .run()
        .success(function () {
          var queryChainer = Entity.queryChainer();

          attachments.forEach(function (attachment) {
            attachment.newsId = newsId;
            attachment = Util.Object.omit(attachment, ['data']);

            queryChainer.add(NewsAttachment.create(attachment, {
              transaction: transaction
            }));
          });

          categoryIds.forEach(function (categoryId) {
            var categoryOfNews = {
              newsId: newsId,
              newsCategoryId: categoryId
            }

            queryChainer.add(CategoryOfNews.create(categoryOfNews, {
              transaction: transaction
            }));
          });

          queryChainer
            .run()
            .success(function (results) {
              for (var i = 0, len = attachments.length; i < len; i++) {
                var blob = ConvertUtil.Blob.fromBase64(attachments[i].data);

                var file = path.join(fileDirectory, 'attachments', '' + results[i].attachmentId);

                fs.writeFileSync(file, blob);
              }

              for (var i = 0, len = deletedAttachments.length; i < len; i++) {
                var file = path.join(fileDirectory, 'attachments', '' + deletedAttachments[i]);

                if (fs.existsSync(file)) {
                  fs.unlinkSync(file);
                }
              }

              updateNewsContent();

              transaction.commit();

              callback(null, false, null);
            })
            .error(function (error) {
              transaction.rollback();
              callback(error);
            });
        })
        .error(function (error) {
          transaction.rollback();
          callback(error);
        });
    }

    function updateNewsContent() {
      var file = path.join(fileDirectory, 'news', '' + newsId);
      fs.writeFileSync(file, newsData.content);
    }

  };

  model.destroy = function (newsId, callback) {

    Entity.transaction(function (transaction) {

      var queryChainer = Entity.queryChainer();

      queryChainer.add(CategoryOfNews.destroy({
        newsId: newsId
      }, {
        transaction: transaction
      }));

      queryChainer.add(NewsAttachment.destroy({
        newsId: newsId
      }, {
        transaction: transaction
      }));

      queryChainer
        .run()
        .success(function () {
          News.destroy({
            newsId: newsId
          }, {
            transaction: transaction
          })
            .success(function () {
              transaction.commit();
              callback(null);
            })
            .error(function (error) {
              transaction.rollback();
              callback(error);
            });
        })
        .error(function (error) {
          transaction.rollback();
          callback(error);
        });

    });

  };

});
