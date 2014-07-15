/*
 * System          : 3connected
 * Component       : Parent entity
 * Creator         : UayLu
 * Created date    : 2014/01/07
 */
define.entity('model.entity.Parent', function (entity, DataType, require) {

  entity.parentId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.studentId = {
    type: DataType.INTEGER,
    allowNull: false,

    references: 'Student',
    referencesKey: 'studentId'
  };

  entity.firstName = {
    type: DataType.STRING(50),
    allowNull: false
  };

  entity.lastName = {
    type: DataType.STRING(100),
    allowNull: false
  };

  entity.relationship = {
    type: DataType.INTEGER,
    allowNull: true,

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

  entity.phoneNumber = {
    type: DataType.INTEGER,
    allowNull: true
  };

  entity.config = {
    table: 'Parent'
  };

  entity.associate = function () {
    this.belongsTo('model.entity.Student', {
      as: 'student'
    });
  };

});
