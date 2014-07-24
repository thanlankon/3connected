/*
 * System          : 3connected
 * Component       : Term entity
 * Creator         : VyBD
 * Modifier        : ThanhVM, UayLU
 * Created date    : 2014/06/13
 */
define.entity('model.entity.Term', function (entity, DataType, require) {

  entity.termId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.termName = {
    type: DataType.STRING(50),
    allowNull: false,
    unique: true
  };

  entity.config = {
    table: 'Term'
  };

  entity.associate = function () {
    this.hasMany('model.entity.Course', {
      as: 'courses'
    });
  }
});
