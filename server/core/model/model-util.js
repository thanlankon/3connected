define('core.model.ModelUtil', function (module, require) {

  var Util = require('core.util.Util');

  var ModelUtil = module.exports = {};

  // findAll method
  ModelUtil.findAllWithOptions = function (Entity, options, callback) {

    var page = options.page;
    var sort = options.sort;
    var attributes = options.attributes;
    var include = options.include;

    var findOptions = {};

    if (page) {
      findOptions.limit = page.size;
      findOptions.offset = page.index * page.size;
    }

    if (sort) {
      findOptions.order = [
        [sort.field, sort.order]
      ];
    }

    if (attributes) {
      findOptions.attributes = attributes;
    }

    if (options.attributes) {
      findOptions.attributes = options.attributes;
    }

    if (options.filters) {
      findOptions.where = {};

      for (var i = 0, len = options.filters.length; i < len; i++) {
        findOptions.where[options.filters[i].field] = {
          like: '%' + options.filters[i].value + '%'
        }
      }
    }

    findOptions.include = include;

    Entity.findAndCountAll(findOptions)
      .success(function (result) {

        var findResult = {
          items: result.rows,
          total: result.count
        };

        callback(null, findResult);
      })
      .error(function (error) {
        callback(error);
      });

  };

  ModelUtil.findOne = function (Entity, options, callback) {
    if (options.id) {
      options = options.id;
    }

    Entity.find(options)
      .success(function (result) {
        var isNotFound = (result == null);

        callback(null, result, isNotFound);
      })
      .error(function (error) {
        callback(error);
      });
  };

  // create method
  ModelUtil.create = function (Entity, entityData, checkDuplicatedData, callback) {

    // check if no checkDuplicatedData passed
    if (Util.Object.isFunction(checkDuplicatedData)) {
      callback = checkDuplicatedData;
      checkDuplicatedData = undefined;
    }

    if (checkDuplicatedData) {
      // create with check existance

      Entity.findOrCreate(checkDuplicatedData, entityData)
        .success(function (result, created) {

          var isDuplicated = !created;

          callback(null, result, isDuplicated);
        })
        .error(function (error) {
          callback(error);
        });
    } else {
      // create without check existance

      Entity.create(entityData)
        .success(function (result) {

          callback(null, result);
        })
        .error(function (error) {
          callback(error);
        });
    }

  };

  // update method
  ModelUtil.update = function (Entity, entityData, checkDuplicatedData, checkExistanceData, callback) {

    // check if no checkDuplicatedData passed
    //    if (Util.Object.isFunction(checkExistanceData)) {
    //      callback = checkExistanceData;
    //      checkExistanceData = undefined;
    //    }

    var findConditions = {
      where: checkExistanceData
    };

    if (checkDuplicatedData) {
      var findDuplicatedConditions = {
        where: checkDuplicatedData
      };

      ModelUtil.findOne(Entity, findDuplicatedConditions, function (error, foundEntity, isNotFound) {
        if (!isNotFound) {
          callback(null, foundEntity, true, false);
        } else {
          findAndUpdate();
        }
      });
    } else {
      findAndUpdate();
    }

    function findAndUpdate() {
      ModelUtil.findOne(Entity, findConditions, function (error, foundEntity, isNotFound) {
        if (isNotFound === true) {

          callback(null, foundEntity, false, true);

          return;
        }

        foundEntity.updateAttributes(entityData)
          .success(function (updatedEntity) {
            callback(null, updatedEntity, false, false);
          })
          .error(function (error) {
            callback(error);
          });
      });
    }

  };

  // destroy method
  ModelUtil.destroy = function (Entity, idAttribute, entityIds, callback) {

    var findConditions = {};
    findConditions[idAttribute] = entityIds;

    Entity.destroy(findConditions)
      .success(function (affectedRows) {

        callback(null, affectedRows);
      })
      .error(function (error) {
        callback(error);
      });

  };

});
