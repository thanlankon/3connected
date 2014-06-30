/*
 * System          : 3connected
 * Component       : Grade entity
 * Creator         : UayLu
 * Created date    : 2014/06/23
 */

define.entity('model.entity.Grade', function (entity, DataType, require) {

  entity.gradeId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.studentId = {
    type: DataType.INTEGER,
    allowNull: false,

    unique: 'grade',

    // reference to Student
    references: 'Student',
    referencesKey: 'studentId'
  };

  entity.gradeCategoryId = {
    type: DataType.INTEGER,
    allowNull: false,

    unique: 'grade',

    // reference to GradeCategory
    references: 'GradeCategory',
    referencesKey: 'gradeCategoryId'
  };

  entity.courseId = {
    type: DataType.INTEGER,
    allowNull: false,

    unique: 'grade',

    // reference to GradeCategory
    references: 'Course',
    referencesKey: 'courseId'
  };

  entity.value = {
    type: DataType.INTEGER,
    allowNull: true
  };

  entity.config = {
    table: 'Grade'
  };

  entity.associate = function () {

    this.belongsTo('model.entity.Student', {
      as: 'student'
    });

    this.belongsTo('model.entity.GradeCategory', {
      as: 'gradeCategory'
    });

    this.belongsTo('model.entity.Course', {
      as: 'course'
    });
  };

});
