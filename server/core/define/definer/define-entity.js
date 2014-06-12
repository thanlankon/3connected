define.entity = function (id, definer) {

  define(id, function (module, require) {

    var Util = require('core.util.Util');
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

    var keys = Util.Object.keys(entity);

    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];

      if (key === 'config' || key === 'static' || key === 'associate') continue;

      if (Util.Object.isFunction(entity[key])) {
        methods[key] = entity[key];
      } else {
        fields[key] = entity[key];
      };
    }

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
