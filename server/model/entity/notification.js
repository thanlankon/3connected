define.entity('model.entity.Notification', function (entity, DataType, require) {

  entity.notificationId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.senderId = {
    type: DataType.INTEGER,
    allowNull: false,

    // reference to Staff
    references: 'Staff',
    referencesKey: 'staffId'
  };

  entity.receiverId = {
    type: DataType.INTEGER,
    allowNull: false,

    // reference to Student
    references: 'Student',
    referencesKey: 'studentId'
  };

  entity.notifyFor = {
    type: DataType.INTEGER,
    allowNull: false
  };

  entity.notificationType = {
    type: DataType.INTEGER,
    allowNull: false
  };

  entity.dataId = {
    type: DataType.INTEGER,
    allowNull: false
  };

  entity.notificationTime = {
    type: DataType.DATE,
    allowNull: false,

    defaultValue: DataType.NOW
  };

  entity.config = {
    table: 'Notification'
  }

  entity.associate = function () {
    this.belongsTo('model.entity.Staff', {
      as: 'sender',
      foreignKey: 'senderId'
    });
    this.belongsTo('model.entity.News', {
      as: 'news',
      foreignKey: 'dataId'
    });
    this.belongsTo('model.entity.Course', {
      as: 'course',
      foreignKey: 'dataId'
    });
  }

});
