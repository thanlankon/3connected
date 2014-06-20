/*
 * System          : 3connected
 * Component       : Course student entity
 * Creator         : UayLU
 * Created date    : 2014/20/06
 */

define.entity('model.entity.CourseStudent', function (entity, DataType, require) {

  entity.courseStudentId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.courseId = {
    type: DataType.INTEGER,
    allowNull: false,
    references: 'Course',
    referencesKey: 'courseId'
  };

  entity.studentId = {
    type: DataType.INTEGER,
    allowNull: false,
    references: 'Student',
    referencesKey: 'studentId'
  };

  entity.config = {
    table: 'CourseStudent'
  };

  entity.associate = function () {

    this.belongsTo('model.entity.Course', {
      as: 'course'
    });
    this.belongsTo('model.entity.Student', {
      as: 'student'
    });

    //    this.hasMany('model.entity.Grade', {
    //        as: 'grades'
    //    });

  };

});
