define.entity('model.entity.Batch', function (entity, DataType, require) {

  entity.batchId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.batchName = {
    type: DataType.STRING(100),
    allowNull: false,
    unique: true
  };

  entity.config = {
    table: 'Batch',
    paranoid: true
  };

  entity.associate = function () {

    //    this.hasMany('model.entity.Class', {
    //      as: 'classes'
    //    });

  };

});
