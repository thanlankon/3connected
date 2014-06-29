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

  entity.config = {
    table: 'NewsCategory'
  };

//  entity.associate = function () {
//
//    this.hasMany('model.entity.Class', {
//      as: 'classes'
//    });
//
//  };

});
