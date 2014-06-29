define('validator.rule.NewsCategory', function (module, require) {

  var ruleNewsCategoryId = {
    // validate for newsCategoryId
    attribute: 'newsCategoryId',
    attributeName: 'newsCategory.newsCategoryId',
    rules: [
      {
        // newsCategoryId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleNewsCategoryName = {
    // validate for newsCategoryName
    attribute: 'newsCategoryName',
    attributeName: 'newsCategory.newsCategoryName',
    rules: [
      {
        // newsCategoryName is required
        rule: 'required'
      },
      {
        // newsCategoryName maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var ruleCreateNewsCategory = [
    ruleNewsCategoryName
  ];

  var ruleUpdateNewsCategory = [
    ruleNewsCategoryId,
  ].concat(ruleCreateNewsCategory);

  var ruleNewsCategory = {
    create: ruleCreateNewsCategory,
    update: ruleUpdateNewsCategory
  };

  module.exports = ruleNewsCategory;

});
