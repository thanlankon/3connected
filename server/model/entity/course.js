/*
 * System          : 3connected
 * Component       : Course entity
 * Creator         : VyBD
 * Modifire        : UayLU
 * Created date    : 2014/17/06
 */

define.entity('model.entity.Course', function (entity, DataType, require) {

  entity.courseId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.classId = {
    type: DataType.INTEGER,
    allowNull: true,
    references: 'Class',
    referencesKey: 'classId'
  };

  entity.courseName = {
    type: DataType.STRING(50),
    allowNull: false
  }

  entity.numberOfCredits = {
    type: DataType.INTEGER,
    allowNull: false
  }

  entity.lectureId = {
    type: DataType.INTEGER,
    allowNull: true,
    references: 'Staff',
    referencesKey: 'staffId'
  }

  entity.subjectVersionId = {
    type: DataType.INTEGER,
    allowNull: false,
    references: 'SubjectVersion',
    referencesKey: 'subjectVersionId'
  }

  entity.termId = {
    type: DataType.INTEGER,
    allowNull: false,
    references: 'Term',
    referencesKey: 'termId'
  }

  entity.majorId = {
    type: DataType.INTEGER,
    allowNull: false,
    references: 'Major',
    referencesKey: 'majorId'
  }

  entity.config = {
    table: 'Course'
  };

  entity.associate = function () {
    //    this.hasOne('model.entity.Lecture', {
    //      as: 'lecture'
    //    });

    this.belongsTo('model.entity.Staff', {
      as: 'staff',
      foreignKey: 'lectureId'
    });

    this.belongsTo('model.entity.Class', {
      as: 'class'
    });

    this.belongsTo('model.entity.Term', {
      as: 'term'
    });

    this.belongsTo('model.entity.Major', {
      as: 'major'
    });

    this.belongsTo('model.entity.SubjectVersion', {
      as: 'subjectVersion'
    });

    this.hasMany('model.entity.Schedule', {
      as: 'schedules'
    });

    this.hasMany('model.entity.CourseStudent', {
      as: 'courseStudents'
    });

  };

});
