/*
 * System          : 3connected
 * Component       : Major entity
 * Creator         : UayLu
 * Modifier        : DungNVH
 * Created date    : 2014/06/14
 */
define.entity('model.entity.Major', function (entity, DataType, require) {

  entity.majorId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.majorName = {
    type: DataType.STRING(50),
    allowNull: false,
    unique: true
  };

  entity.config = {
    table: 'Major'
  };

  entity.associate = function () {
    this.hasMany('model.entity.Class', {
      as: 'classes'
    });

    this.hasMany('model.entity.Course', {
      as: 'courses'
    });
  };

});
