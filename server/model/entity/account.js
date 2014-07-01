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
    allowNull: false
  };

  entity.password = {
    type: DataType.STRING(50),
    allowNull: false
  }

  entity.role = {
    type: DataType.INTEGER,
    allowNull: false
  }

  entity.userInformationId = {
    type: DataType.INTEGER,
    allowNull: true
  }

  entity.isActive = {
    type: DataType.INTEGER,
    allowNull: false
  }

  entity.effectiveDate = {
    type: DataType.DATE,
    allowNull: false
  }

  entity.expireDate = {
    type: DataType.DATE,
    allowNull: false
  }

  entity.config = {
    table: 'Account'
  };

  entity.associate = function () {

  };

});
