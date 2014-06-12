define('core.model.entity.EntityContainer', function (module, require) {

  var Util = require('core.util.Util');

  var EntityContainer = {
    Entities: [],

    resoleAssociations: resoleAssociations
  };

  module.exports = EntityContainer;

  function resoleAssociations() {
    var entities = EntityContainer.Entities;

    for (i = 0, len = entities.length; i < len; i++) {
      var Entity = require(entities[i].id);

      entities[i].associate.apply(new AssociationBinder(Entity));
    }
  }

  function AssociationBinder(entity) {
    this.belongsTo = function (id, options) {
      var model = require(id);

      entity.belongsTo(model, options);
    };

    this.hasOne = function (id, options) {
      var model = require(id);

      entity.hasOne(model, options);
    };

    this.hasMany = function (id, options) {
      var model = require(id);

      entity.hasMany(model, options);
    };
  }

});
