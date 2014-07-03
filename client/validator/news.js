define('validator.rule.News', function (module, require) {

  var ruleNewsId = {
    // validate for newsId
    attribute: 'newsId',
    attributeName: 'news.newsId',
    rules: [
      {
        // newsId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleNewsTitle = {
    // validate for title
    attribute: 'title',
    attributeName: 'news.title',
    rules: [
      {
        // title is required
        rule: 'required'
      },
      {
        // title maximum length is 200
        rule: 'maxLength',
        ruleData: {
          maxLength: 200
        }
      }
    ]
  };

  var ruleNewsContent = {
    // validate for content
    attribute: 'content',
    attributeName: 'news.content',
    rules: [
      {
        // content is required
        rule: 'required'
      }
    ]
  };

  var ruleNewsCategories = {
    // validate for categoryIds
    attribute: 'categoryIds',
    attributeName: 'news.categories',
    rules: [
      {
        // categoryIds is required
        rule: 'required'
      }
    ]
  };

  var ruleCreateNews = [
    ruleNewsTitle,
    ruleNewsContent,
    ruleNewsCategories
  ];

  var ruleUpdateNews = [
    ruleNewsId,
  ].concat(ruleCreateNews);

  var ruleNews = {
    create: ruleCreateNews,
    update: ruleUpdateNews
  };

  module.exports = ruleNews;

});
