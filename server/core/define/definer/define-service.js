define.service = function (id, definer) {

  define(id, function (module, require) {

    var Util = require('core.util.Util');
    var ServiceUtil = require('core.service.ServiceUtil');

    var ServiceContainer = require('core.service.ServiceContainer');

    ServiceContainer.ServiceIds.push(id);

    var service = {};

    definer(service, require, ServiceUtil, Util);

    // check and add default map.methods
    if (!service.map.methods) {
      service.map.methods = {};
    }

    var serviceMap = service.map;
    var methodConfig = service.methodConfig;
    var serviceModel = service.Model;

    // if model is string, require it
    if (Util.Object.isString(serviceModel)) {
      serviceModel = require(serviceModel);
    }

    if (isMethodAllowed(methodConfig, 'findAll')) {
      // add service findAll method

      var findAllConfig = methodConfig.findAll || {};

      service.findAll = service.findAll || function (req, res) {
        ServiceUtil.doFindAll(req, res, serviceModel, findAllConfig);
      };

      createDefaultMap(serviceMap, 'findAll', '/findAll', 'GET');
    }

    if (isMethodAllowed(methodConfig, 'findOne')) {
      // add service findOne method

      var findOneConfig = methodConfig.findOne || {};
      findOneConfig.idAttribute = methodConfig.idAttribute;
      findOneConfig.messageData = methodConfig.message;

      service.findOne = service.findOne || function (req, res) {
        ServiceUtil.doFindOne(req, res, serviceModel, findOneConfig);
      };

      createDefaultMap(serviceMap, 'findOne', '/findOne', 'GET');
    }

    if (isMethodAllowed(methodConfig, 'create')) {
      // add service create method

      var createConfig = methodConfig.create || {};
      createConfig.messageData = methodConfig.message;

      service.create = service.create || function (req, res) {
        ServiceUtil.doCreate(req, res, serviceModel, createConfig);
      };

      createDefaultMap(serviceMap, 'create', '/create', 'POST');
    }

    if (isMethodAllowed(methodConfig, 'update')) {
      // add service update method

      var updateConfig = methodConfig.update || {};
      updateConfig.idAttribute = methodConfig.idAttribute;
      updateConfig.messageData = methodConfig.message;

      service.update = service.update || function (req, res) {
        ServiceUtil.doUpdate(req, res, serviceModel, updateConfig);
      };

      createDefaultMap(serviceMap, 'update', '/update', 'POST');
    }

    if (isMethodAllowed(methodConfig, 'destroy')) {
      // add service destroy method

      var destroyConfig = methodConfig.destroy || {};
      destroyConfig.idAttribute = methodConfig.idAttribute;
      destroyConfig.messageData = methodConfig.message;

      service.destroy = service.destroy || function (req, res) {
        ServiceUtil.doDestroy(req, res, serviceModel, destroyConfig);
      };

      createDefaultMap(serviceMap, 'destroy', '/destroy', 'POST');
    }

    module.exports = service;

  });

  function isMethodAllowed(methodConfig, methodName) {
    var disallowed = !methodConfig || (methodConfig && (
      methodConfig.disableMethods === true || (
      methodConfig[methodName] &&
      methodConfig[methodName].disabled === true
    )));

    return !disallowed;
  }

  function createDefaultMap(serviceMap, methodName, url, httpMethod) {
    if (!serviceMap.methods[methodName]) {
      serviceMap.methods[methodName] = {
        url: url
      };
    }

    if (!serviceMap.methods[methodName].httpMethod) {
      serviceMap.methods[methodName].httpMethod = httpMethod;
    }
  }

};
