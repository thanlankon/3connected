/*
 * System          : 3connected
 * Component       : Schedule entity
 * Creator         : TrongND
 * Created date    : 2014/06/22
 */

define.entity('model.entity.Schedule', function (entity, DataType, require) {

  var ConvertUtil = require('core.util.ConvertUtil');

  entity.scheduleId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.date = {
    type: DataType.DATE,
    allowNull: false,
    unique: 'scheduleSlot'
  };

  entity.slot = {
    type: DataType.INTEGER,
    allowNull: false,
    unique: 'scheduleSlot'
  };

  entity.courseId = {
    type: DataType.INTEGER,
    allowNull: false,

    // reference to Course
    references: 'Course',
    referencesKey: 'courseId'
  };

  entity.config = {
    table: 'Schedule'
  };

  entity.associate = function () {

    this.belongsTo('model.entity.Course', {
      as: 'course'
    });

    this.hasMany('model.entity.Attendance', {
      as: 'attendances'
    });

  };

});
