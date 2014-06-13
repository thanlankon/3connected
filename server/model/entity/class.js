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

  entity.config = {
    table: 'Class'
  }

  entity.associate = function () {
    this.belongsTo('model.entity.Batch', {
      as: 'batch'
    });
  }

});
