/*
 * System          : 3connected
 * Component       : Batch entity
 * Creator         : TrongND
 * Created date    : 2014/06/13
 */
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
    table: 'Batch'
  };

  entity.associate = function () {

    this.hasMany('model.entity.Class', {
      as: 'classes'
    });

  };

});
