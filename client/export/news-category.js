define('export.NewsCategory', function (module, require) {

  module.exports = {

    fileName: 'NewsCategory',
    sheetName: 'NewsCategory',

    columns: {

      newsCategoryId: {
        width: 10
      },
      newsCategoryName: {
        width: 50
      }

    }

  };

});
