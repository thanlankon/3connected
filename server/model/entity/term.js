define.entity('model.entity.Term', function (entity, DataType, require) {

  entity.termId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.termName = {
    type: DataType.STRING(50),
    allowNull: false,
    unique: true
  };

  entity.config = {
    table: 'Term'
  };

  entity.associate = function () {
    this.hasMany('model.entity.Course', {
      as: 'courses'
    });
  }
});
