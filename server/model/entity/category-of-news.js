define.entity('model.entity.CategoryOfNews', function (entity, DataType, require) {

  entity.categoryOfNewsId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.newsCategoryId = {
    type: DataType.INTEGER,
    allowNull: false,

    // reference to NewsCategory
    references: 'NewsCategory',
    referencesKey: 'newsCategoryId',

    unique: 'categoryOfNews'
  };

  entity.newsId = {
    type: DataType.INTEGER,
    allowNull: false,

    // reference to News
    references: 'News',
    referencesKey: 'newsId',

    unique: 'categoryOfNews'
  };

  entity.config = {
    table: 'CategoryOfNews'
  };

  entity.associate = function () {
    this.belongsTo('model.entity.News', {
      as: 'news',
      foreignKey: 'newsId'
    });
    this.belongsTo('model.entity.NewsCategory', {
      as: 'newsCategory'
    });
  };

});
