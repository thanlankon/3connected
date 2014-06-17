/*
 * System          : 3connected
 * Component       : Subject Version entity
 * Creator         : VyBD
 * Created date    : 2014/17/06
 */

define.entity('model.entity.SubjectVersion', function (entity, DataType, require) {

  entity.subjectVersionId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.subjectId = {
    type: DataType.INTEGER,
    allowNull: false
  };

  entity.description = {
    type: DataType.STRING(50),
    allowNull: false,
    unique: true
  };

  entity.config = {
    table: 'SubjectVersion'
  };

  entity.associate = function () {

    this.belongsTo('model.entity.Subject', {
      as: 'subject'
    });

  };

});
