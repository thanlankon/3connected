//ThanhVMSE90059
define.entity('model.entity.Department', function (entity, DataType, require) {

  entity.departmentId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.departmentName = {
    type: DataType.STRING(50),
    allowNull: false,
    unique: true
  };

  entity.config = {
    table: 'Department'
  };

});
