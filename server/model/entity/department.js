/*
 * System          : 3connected
 * Component       : Department entity
 * Creator         : ThanhVM
 * Created date    : 2014/16/06
 */

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

entity.associate = function () {
   this.hasMany('model.entity.Staff', {
      as: 'staffs'
    });
}

});
