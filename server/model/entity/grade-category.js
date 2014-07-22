/*
 * System          : 3connected
 * Component       : Grade category entity
 * Creator         : UayLU
 * Created date    : 2014/19/06
 */

define.entity('model.entity.GradeCategory', function (entity, DataType, require) {

  entity.gradeCategoryId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.subjectVersionId = {
    type: DataType.INTEGER,
    allowNull: false,
    references: 'SubjectVersion',
    referencesKey: 'subjectVersionId'
  };

  entity.gradeCategoryCode = {
    type: DataType.STRING(50),
    allowNull: false,
  };

  entity.gradeCategoryName = {
    type: DataType.STRING(50),
    allowNull: false,
  };

  entity.minimumGrade = {
    type: DataType.INTEGER,
    allowNull: true,
  };


  entity.weight = {
    type: DataType.INTEGER,
    allowNull: false,
  };

  entity.config = {
    table: 'GradeCategory'
  };

  entity.associate = function () {

    this.belongsTo('model.entity.SubjectVersion', {
      as: 'subjectVersion'
    });

    this.hasMany('model.entity.Grade', {
      as: 'grades'
    });

  };

});
