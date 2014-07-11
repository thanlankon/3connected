define.entity('model.entity.NewsAttachment', function (entity, DataType, require) {

  entity.attachmentId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.newsId = {
    type: DataType.INTEGER,
    allowNull: false,

    // reference to News
    references: 'News',
    referencesKey: 'newsId'
  };

  entity.name = {
    type: DataType.STRING(200),
    allowNull: false
  };

  entity.extension = {
    type: DataType.STRING(10),
    allowNull: false
  };

  entity.size = {
    type: DataType.INTEGER,
    allowNull: false
  };

  entity.data = {
    type: DataType.BLOB,
    allowNull: false
  };

  entity.config = {
    table: 'NewsAttachment'
  };

  entity.associate = function () {
    this.belongsTo('model.entity.News', {
      as: 'news',
      foreignKey: 'newsId'
    });
  };

});
