define.entity('model.entity.Student', function (entity, DataType, require) {

  entity.id = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.studentId = {
    type: DataType.STRING(100),
    allowNull: false,
    unique: true
  };

  entity.studentName = {
    type: DataType.STRING(255),
    allowNull: false
  };

  entity.classId = {
    type: DataType.INTEGER,
    allowNull: false,

    references: 'Class',
    referencesKey: 'id'
  };

  entity.config = {
    table: 'Student',

    paranoid: true
  };

  entity.associate = function () {
    this.belongsTo('model.entity.Class', {
      as: 'class'
    });
  }

});
