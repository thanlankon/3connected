/*
 * System          : 3connected
 * Component       : AccessToken entity
 * Creator         : TrongND
 * Created date    : 2014/07/04
 */

define.entity('model.entity.AccessToken', function (entity, DataType, require) {

  entity.accessToken = {
    type: DataType.STRING(50),
    primaryKey: true
  };

  entity.accountId = {
    type: DataType.INTEGER,
    allowNull: false,

    // reference to Account
    references: 'Account',
    referencesKey: 'accountId'
  };

  entity.lastAccessTime = {
    type: DataType.DATE,
    allowNull: false
  };

  entity.timeToLive = {
    type: DataType.INTEGER,
    allowNull: false
  };

  entity.associate = function () {
    this.belongsTo('model.entity.Account', {
      as: 'account'
    });
  };

});
