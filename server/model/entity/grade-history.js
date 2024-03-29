/*
 * System          : 3connected
 * Component       : Grade history entity
 * Creator         : UayLu
 * Created date    : 2014/23/06
 */
define.entity('model.entity.GradeHistory', function (entity, DataType, require) {

  entity.gradeHistoryId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.oldValue = {
    type: DataType.INTEGER,
    allowNull: true
  };

  entity.newValue = {
    type: DataType.INTEGER,
    allowNull: true
  };

  entity.time = {
    type: DataType.DATE,
    allowNull: false,

    defaultValue: DataType.NOW
  };

  entity.gradeId = {
    type: DataType.INTEGER,
    allowNull: true,

    // reference to Grade
    references: 'Grade',
    referencesKey: 'gradeId'
  };

  entity.staffId = {
    type: DataType.INTEGER,
    allowNull: true,

    // reference to Staff
    references: 'Staff',
    referencesKey: 'staffId'
  };

  entity.config = {
    table: 'GradeHistory'
  }

  entity.associate = function () {

    this.belongsTo('model.entity.Staff', {
      as: 'staff'
    });

    this.belongsTo('model.entity.Grade', {
      as: 'grade'
    });
  }

});
