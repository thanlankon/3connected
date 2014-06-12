define.model = function (id, definer) {

  define(id, function (module, require) {

    var ModelUtil = require('core.model.ModelUtil');

    var model = {};

    definer(model, ModelUtil, require);

    var modelEntity = model.Entity;
    var methodConfig = model.methodConfig;

    if (isMethodAllowed(methodConfig, 'findOne')) {
      // add findOne method
      model.findOne = function (options, callback) {
        ModelUtil.findOne(modelEntity, options, callback);
      }
    }

    if (isMethodAllowed(methodConfig, 'findAll')) {
      // add findAll method
      model.findAll = function (options, callback) {
        ModelUtil.findAllWithOptions(modelEntity, options, callback);
      }
    }

    if (isMethodAllowed(methodConfig, 'create')) {
      // add create method
      model.create = function (entityData, checkDupplicatedData, callback) {
        ModelUtil.create(modelEntity, entityData, checkDupplicatedData, callback);
      }
    }

    if (isMethodAllowed(methodConfig, 'update')) {
      // add update method
      model.update = function (entityData, checkDupplicatedData, checkExistanceData, callback) {
        ModelUtil.update(modelEntity, entityData, checkDupplicatedData, checkExistanceData, callback);
      }
    }

    if (isMethodAllowed(methodConfig, 'destroy')) {
      // add destroy method
      model.destroy = function (idAttribute, entityIds, callback) {
        ModelUtil.destroy(modelEntity, idAttribute, entityIds, callback);
      }
    }

    module.exports = model;

  });

  function isMethodAllowed(methodConfig, methodName) {
    var disallowed = methodConfig &&
      methodConfig[methodName] &&
      methodConfig[methodName].disabled === true;

    return !disallowed;
  }

};
