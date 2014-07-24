/*
 * System          : 3connected
 * Component       : Class entity
 * Creator         : ThanhVM
 * Modifier        : UayLU, VyBD
 * Created date    : 2014/06/13
 */
define.entity('model.entity.Class', function (entity, DataType, require) {

  entity.classId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.className = {
    type: DataType.STRING(50),
    allowNull: false
  };

  entity.batchId = {
    type: DataType.INTEGER,
    allowNull: false,

    // reference to Batch
    references: 'Batch',
    referencesKey: 'batchId'
  };

  entity.majorId = {
    type: DataType.INTEGER,
    allowNull: false,

    // reference to Major
    references: 'Major',
    referencesKey: 'majorId'
  };

  entity.config = {
    table: 'Class'
  }

  entity.associate = function () {
    this.hasMany('model.entity.Course', {
      as: 'courses'
    });

    this.belongsTo('model.entity.Batch', {
      as: 'batch'
    });

    this.belongsTo('model.entity.Major', {
      as: 'major'
    });
  }

});
