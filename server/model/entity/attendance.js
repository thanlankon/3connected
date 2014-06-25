define.entity('model.entity.Attendance', function (entity, DataType, require) {

  entity.attendanceId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.studentId = {
    type: DataType.INTEGER,
    allowNull: false,

    unique: 'attendance',

    // reference to Student
    references: 'Student',
    referencesKey: 'studentId'
  };

  entity.scheduleId = {
    type: DataType.INTEGER,
    allowNull: false,

    unique: 'attendance',

    // reference to Schedule
    references: 'Schedule',
    referencesKey: 'scheduleId'
  };

  entity.status = {
    type: DataType.INTEGER,
    allowNull: false
  };

  entity.config = {
    table: 'Attendance'
  };

  entity.associate = function () {

    this.belongsTo('model.entity.Student', {
      as: 'student'
    });

    this.belongsTo('model.entity.Schedule', {
      as: 'schedule'
    });

  };

});
