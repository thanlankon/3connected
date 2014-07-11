define.entity('model.entity.News', function (entity, DataType, require) {

  entity.newsId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.title = {
    type: DataType.STRING(200),
    allowNull: false
  };

  entity.content = {
    type: DataType.TEXT,
    allowNull: false,
  };

  entity.content = {
    type: DataType.TEXT,
    allowNull: false,
  };

  entity.createdTime = {
    type: DataType.DATE,
    allowNull: false,

    defaultValue: DataType.NOW
  };

  entity.config = {
    table: 'News'
  };

  entity.associate = function () {
    this.hasMany('model.entity.NewsAttachment', {
      as: 'attachments',
      foreignKey: 'newsId'
    });

    this.hasMany('model.entity.CategoryOfNews', {
      as: 'categories',
      foreignKey: 'newsId'
    });
  };

});
