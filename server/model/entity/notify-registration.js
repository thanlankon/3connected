define.entity('model.entity.NotifyRegistration', function (entity, DataType, require) {

  entity.notifyRegistrationId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.receiverId = {
    type: DataType.INTEGER,
    allowNull: false,

    // reference to Student
    references: 'Student',
    referencesKey: 'studentId'
  };

  entity.registerFor = {
    type: DataType.INTEGER,
    allowNull: false
  };

  entity.serviceProvider = {
    type: DataType.INTEGER,
    allowNull: true
  };

  entity.registrationKey = {
    type: DataType.STRING(255),
    allowNull: false,
    unique: true
  };

  entity.config = {
    table: 'NotifyRegistration'
  }

  entity.associate = function () {}

});
