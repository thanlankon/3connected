define.entity('model.entity.Major', function (entity, DataType, require) {

  entity.majorId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.majorName = {
    type: DataType.STRING(50),
    allowNull: false,
    unique: true
  };

  entity.config = {
    table: 'Major'
  };

  entity.associate = function () {
    this.hasMany('model.entity.Class', {
      as: 'classes'
    });
  };

});
