/*
 * System          : 3connected
 * Component       : Subject entity
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */
define.entity('model.entity.Subject', function (entity, DataType, require) {

  entity.subjectId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.subjectCode = {
    type: DataType.STRING(6),
    allowNull: false,
    unique: true
  };

  entity.subjectName = {
    type: DataType.STRING(100),
    allowNull: false
  };

  entity.numberOfCredits = {
    type: DataType.INTEGER,
    allowNull: false
  };

  entity.config = {
    table: 'Subject'
  };

  entity.associate = function () {

    this.hasMany('model.entity.SubjectVersion', {
      as: 'subjectVersions'
    });

  };

});
