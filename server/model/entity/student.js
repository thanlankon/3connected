define.entity('model.entity.Student', function (entity, DataType, require) {

  entity.studentId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.studentCode = {
    type: DataType.STRING(20),
    allowNull: false,
    unique: true
  };

  entity.firstName = {
    type: DataType.STRING(50),
    allowNull: false
  };

  entity.lastName = {
    type: DataType.STRING(100),
    allowNull: false
  };

  entity.classId = {
    type: DataType.INTEGER,
    allowNull: true,

    references: 'Class',
    referencesKey: 'classId'
  };

  entity.gender = {
    type: DataType.INTEGER,
    allowNull: false
  };

  entity.dateOfBirth = {
    type: DataType.DATE,
    allowNull: false
  };

  entity.address = {
    type: DataType.STRING(500),
    allowNull: true
  };

  entity.email = {
    type: DataType.STRING(100),
    allowNull: true
  };

  entity.config = {
    table: 'Student'
  };

  entity.associate = function () {
    this.belongsTo('model.entity.Class', {
      as: 'class'
    });

    //    this.hasOne('model.entity.Course', {
    //      as: 'course',
    //      foreignKey: 'courseId',
    //      through: 'CourseStudent'
    //    });
  };

});
