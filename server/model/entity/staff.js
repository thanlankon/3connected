define.entity('model.entity.Staff', function (entity, DataType, require) {

  entity.staffId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.staffCode = {
    type: DataType.STRING(50),
    allowNull: false
  };

  entity.firstName = {
    type: DataType.STRING(50),
    allowNull: false
  };

  entity.lastName = {
    type: DataType.STRING(100),
    allowNull: false
  };

  entity.departmentId = {
    type: DataType.INTEGER,
    allowNull: false,

    references: 'Department',
    referencesKey: 'departmentId'
  };

  entity.gender = {
    type: DataType.INTEGER,
    allowNull: false
  };

  entity.dateOfBirth = {
    type: DataType.DATE,
    allowNull: false
  };

  entity.address = {
    type: DataType.STRING(500),
    allowNull: true
  };

  entity.email = {
    type: DataType.STRING(100),
    allowNull: true
  };

  entity.config = {
    table: 'Staff'
  };

  entity.associate = function () {
    this.belongsTo('model.entity.Department', {
      as: 'department'
    });
  };

});
