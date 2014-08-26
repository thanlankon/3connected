define.entity('model.entity.NewsCategory', function (entity, DataType, require) {

  entity.newsCategoryId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.newsCategoryName = {
    type: DataType.STRING(100),
    allowNull: false,
    unique: 'newsCategory'
  };

  entity.parentCategoryId = {
    type: DataType.INTEGER,
    allowNull: true,
    unique: 'newsCategory'

    // reference to news category
    references: 'NewsCategory',
    referencesKey: 'newsCategoryId'
  };

  entity.config = {
    table: 'NewsCategory'
  };

  entity.associate = function () {

    this.belongsTo('model.entity.NewsCategory', {
      as: 'parentCategory',
      foreignKey: 'parentCategoryId'
    });

  };

});
