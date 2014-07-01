define.entity('model.entity.NewsCategory', function (entity, DataType, require) {

  entity.newsCategoryId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.newsCategoryName = {
    type: DataType.STRING(100),
    allowNull: false,
    unique: true
  };

  entity.parentCategoryId = {
    type: DataType.INTEGER,
    allowNull: true,

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
