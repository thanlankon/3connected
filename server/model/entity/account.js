/*
 * System          : 3connected
 * Component       : account entity
 * Creator         : UayLU
 * Created date    : 2014/01/07
 */

define.entity('model.entity.Account', function (entity, DataType, require) {

  entity.accountId = {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  entity.username = {
    type: DataType.STRING(50),
    allowNull: false,
    unique: 'account',
  };

  entity.password = {
    type: DataType.STRING(50),
    allowNull: false
  }

  entity.role = {
    type: DataType.INTEGER,
    allowNull: false,
    unique: 'account',
  }

  entity.userInformationId = {
    type: DataType.INTEGER,
    allowNull: false
  }

  entity.isActive = {
    type: DataType.BOOLEAN,
    allowNull: true
  }

  entity.expiredDate = {
    type: DataType.DATE,
    allowNull: true
  }

  entity.config = {
    table: 'Account'
  };

  entity.associate = function () {

  };

});
