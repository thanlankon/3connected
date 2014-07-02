define.entity('model.entity.AttendanceHistory', function (entity, DataType, require) {

  entity.attendanceHistoryId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.oldValue = {
    type: DataType.INTEGER,
    allowNull: true
  };

  entity.newValue = {
    type: DataType.INTEGER,
    allowNull: true
  };

  entity.time = {
    type: DataType.DATE,
    allowNull: false,

    defaultValue: DataType.NOW
  };

  entity.attendanceId = {
    type: DataType.INTEGER,
    allowNull: false,

    // reference to Attendance
    references: 'Attendance',
    referencesKey: 'attendanceId'
  };

  entity.staffId = {
    type: DataType.INTEGER,
    allowNull: true,

    // reference to Staff
    references: 'Staff',
    referencesKey: 'staffId'
  };

  entity.config = {
    table: 'AttendanceHistory'
  }

  entity.associate = function () {

    this.belongsTo('model.entity.Staff', {
      as: 'staff'
    });

    this.belongsTo('model.entity.Attendance', {
      as: 'attendance'
    });
  }

});
