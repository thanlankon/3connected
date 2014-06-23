define.entity = function (id, definer) {

  define(id, function (module, require) {

    var Util = require('core.util.Util');
    var ConvertUtil = require('core.util.ConvertUtil');
    var Entity = require('core.model.Entity');
    var DataType = require('core.model.DataType');
    var EntityContainer = require('core.model.entity.EntityContainer');

    var entity = {
      config: {},
      static: {}
    };

    definer(entity, DataType, require);

    if (entity.associate) {
      EntityContainer.Entities.push({
        id: id,
        associate: entity.associate
      });
    }

    var fields = {};
    var methods = {};
    var config = {};

    Util.Collection.each(entity, function (value, key) {

      if (key === 'config' || key === 'static' || key === 'associate') return;

      if (value.type == DataType.DATE) {
        value.get = function () {
          var date = this.getDataValue(key);
          console.log(id, key, date, ConvertUtil.DateTime.formatDate(date));
          return ConvertUtil.DateTime.formatDate(date);
        };

        value.set = function (value) {
          var date = ConvertUtil.DateTime.toMySqlDate(value);
          console.log(id, key, value, date);
          return this.setDataValue(key, date);
        };
      }

      if (Util.Object.isFunction(value)) {
        methods[key] = value;
      } else {
        fields[key] = value;
      };

    });

    config.instanceMethods = methods;
    config.classMethods = entity.static;

    config.freezeTableName = true;
    config.tableName = entity.config.table;
    // disable timestamps
    config.timestamps = false;

    Util.Object.extend(config, entity.config.fields);

    var entityName = id.slice(id.lastIndexOf('.') + 1);

    module.exports = Entity.define(entityName, fields, config);

  });

};
