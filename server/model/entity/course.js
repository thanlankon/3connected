/*
 * System          : 3connected
 * Component       : Course entity
 * Creator         : VyBD
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
    allowNull: false
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
    allowNull: true
  }

  entity.subjectVersionId = {
    type: DataType.INTEGER,
    allowNull: false
  }

  entity.termId = {
    type: DataType.INTEGER,
    allowNull: false
  }

  entity.majorId = {
    type: DataType.INTEGER,
    allowNull: false
  }

  entity.config = {
    table: 'Course'
  };

  entity.associate = function () {
    //    this.hasOne('model.entity.Lecture', {
    //      as: 'lecture'
    //    });

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
