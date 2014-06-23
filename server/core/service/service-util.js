define('core.service.ServiceUtil', function (module, require) {

  var Util = require('core.util.Util');

  var ServiceUtil = module.exports = {};

  // build find options from query
  ServiceUtil.buildFindOptions = function (data) {

    var page = null;
    if (data.pageSize) {
      page = {
        size: data.pageSize,
        index: data.pageIndex || 0
      };
    }

    var sort = null;
    if (data.sortField) {
      sort = {
        field: data.sortField,
        order: data.sortOrder ? data.sortOrder.toUpperCase() : 'ASC'
      };
    }

    var filters = data.filters || null;
    var excludeFilters = data.excludeFilters || null;

    var options = {};

    if (page) {
      options.page = page;
    }

    if (sort) {
      options.sort = sort;
    }

    if (filters) {
      options.filters = filters;
    }

    if (excludeFilters) {
      options.excludeFilters = excludeFilters;
    }

    return options;

  };

  // send service response
  ServiceUtil.sendServiceResponse = function (res, error, message, data) {

    var responeData = {
      _service: {}
    };

    if (error) {
      responeData._service.error = error;

      if (!message) {
        responeData._service.message = 'error.service.unknown';
      }
    }

    if (message) {
      responeData._service.message = message;
    }

    responeData.data = data || {};

    res.send(responeData);

  };

  // findAll method
  ServiceUtil.doFindAll = function (req, res, Model, findAllConfig) {

    var findOptions = ServiceUtil.buildFindOptions(req.query);

    if (findAllConfig.buildFindOptions) {
      var buildFindOptions = findAllConfig.buildFindOptions(findOptions);

      if (buildFindOptions) {
        findOptions = buildFindOptions;
      }

      doIncludes(findOptions);
    }

    Model.findAll(findOptions, function (error, findResult) {
      if (error) {
        var message = 'error.findAll.unknown';
      } else {
        var message = null;
      }

      ServiceUtil.sendServiceResponse(res, error, message, findResult);
    });

  };

  // findOne method
  ServiceUtil.doFindOne = function (req, res, Model, findOneConfig) {

    var idAttribute = findOneConfig.idAttribute || 'id';
    var entityId = req.query[idAttribute];

    var whereCondition = {};
    whereCondition[idAttribute] = entityId;

    var findOptions = {
      where: whereCondition
    };

    if (findOneConfig.buildFindOptions) {
      var buildFindOptions = findOneConfig.buildFindOptions(findOptions);

      if (buildFindOptions) {
        findOptions = buildFindOptions;
      }

      doIncludes(findOptions);
    }

    var findMessage = findOneConfig.message || {
      notFound: 'entity.findOne.notFound'
    };

    Model.findOne(findOptions, function (error, findResult, isNotFound) {
      if (error) {
        var message = 'error.findOne.unknown';
      } else {
        var message = null;

        if (isNotFound === true) {
          error = {
            code: 'ENTITY.NOT_FOUND'
          };

          message = {
            messageId: findMessage.notFound,
            messageData: findOneConfig.messageData
          };
        }
      }

      ServiceUtil.sendServiceResponse(res, error, message, findResult);
    });

  };

  // create method
  ServiceUtil.doCreate = function (req, res, Model, createConfig) {

    var attributes = createConfig.attributes || undefined;
    var checkDuplicatedAttributes = createConfig.checkDuplicatedAttributes || undefined;
    var createMessage = createConfig.message || {
      duplicated: 'entity.create.duplicated',
      success: 'entity.create.success'
    };

    var entityData = attributes ?
      Util.Object.pick(req.body, attributes) : req.body;
    var checkDuplicatedData = checkDuplicatedAttributes ?
      Util.Object.pick(req.body, checkDuplicatedAttributes) : undefined;

    Model.create(entityData, checkDuplicatedData, function (error, createdEntity, isDuplicated) {
      if (error) {
        var message = 'error.create.unknown';
      } else {
        var message = {
          messageId: createMessage.success
        };

        if (isDuplicated === true) {
          error = {
            code: 'ENTITY.DUPLICATE'
          };

          message = {
            messageId: createMessage.duplicated
          };
        }

        message.messageData = createConfig.messageData;
      }

      ServiceUtil.sendServiceResponse(res, error, message, createdEntity);
    });
  };

  // update method
  ServiceUtil.doUpdate = function (req, res, Model, updateConfig) {

    var idAttribute = updateConfig.idAttribute || 'id';

    var attributes = updateConfig.attributes || undefined;
    var checkExistanceAttributes = updateConfig.checkExistanceAttributes || undefined;
    var checkDuplicatedAttributes = updateConfig.checkDuplicatedAttributes || undefined;
    var updateMessage = updateConfig.message || {
      notFound: 'entity.update.notFound',
      duplicated: 'entity.update.duplicated',
      success: 'entity.update.success'
    };

    var entityData = attributes ?
      Util.Object.pick(req.body, attributes) : req.body;
    var checkDuplicatedData = checkDuplicatedAttributes ?
      Util.Object.pick(req.body, checkDuplicatedAttributes) : undefined;
    var checkExistanceData = checkExistanceAttributes ?
      Util.Object.pick(req.body, checkExistanceAttributes) : undefined;

    if (checkDuplicatedData) {
      checkDuplicatedData[idAttribute] = {
        ne: req.body[idAttribute]
      };
    }

    Model.update(entityData, checkDuplicatedData, checkExistanceData,
      function (error, updatedEntity, isDuplicated, isNotFound) {
        if (error) {
          var message = 'error.update.unknown';
        } else {
          var message = {
            messageId: updateMessage.success
          };

          if (isDuplicated === true) {
            error = {
              code: 'ENTITY.DUPLICATE'
            };

            message = {
              messageId: updateMessage.duplicated
            };
          } else if (isNotFound === true) {
            error = {
              code: 'ENTITY.NOT_FOUND'
            };

            message = {
              messageId: updateMessage.notFound
            };
          }

          message.messageData = updateConfig.messageData;
        }

        console.log('update', message);

        ServiceUtil.sendServiceResponse(res, error, message, updatedEntity);
      });
  };

  // create method
  ServiceUtil.doDestroy = function (req, res, Model, destroyConfig) {

    var idAttribute = destroyConfig.idAttribute || 'id';
    var entityIds = req.body[idAttribute];

    if (!Util.Object.isArray(entityIds)) {
      entityIds = [entityIds];
    }

    var destroyMessage = destroyConfig.message || {
      incomplete: 'entity.destroy.incomplete',
      success: 'entity.destroy.success'
    };

    Model.destroy(idAttribute, entityIds, function (error, affectedRows) {
      if (error) {
        var message = 'error.destroy.unknown';
      } else {
        var message = {
          messageId: destroyMessage.success
        };

        if (affectedRows !== entityIds.length) {
          error = {
            code: 'ENTITY.DELETE_INCOMPLETED'
          };

          message = {
            messageId: destroyMessage.incomplete
          };
        }

        var data = {
          destroyedItems: affectedRows
        };

        message.messageData = destroyConfig.messageData;
      }

      ServiceUtil.sendServiceResponse(res, error, message, data);
    });
  };

  // helper methods

  function doIncludes(findOptions) {
    if (findOptions.include) {
      for (var i = 0, len = findOptions.include.length; i < len; i++) {
        if (findOptions.include[i].entity) {
          findOptions.include[i].model = findOptions.include[i].entity;
        } else {
          findOptions.include[i].model = findOptions.include[i].model.Entity;
        }

        doIncludes(findOptions.include[i]);
      }
    }
  }

});
