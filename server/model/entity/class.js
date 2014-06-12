define.entity('model.entity.Class', function (entity, DataType, require) {

  entity.id = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.className = {
    type: DataType.STRING(50),
    allowNull: false
  };

  entity.config = {
    table: 'Class'
  }

  entity.associate = function () {
    this.hasMany('model.entity.Student', {
      as: 'students'
    });
  }

});
