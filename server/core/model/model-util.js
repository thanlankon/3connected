define('core.model.ModelUtil', function (module, require) {

  var Util = require('core.util.Util');
  var ConvertUtil = require('core.util.ConvertUtil');

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
      findOptions.order = buildSort(sort, Entity.tableName);
    }

    if (attributes) {
      findOptions.attributes = attributes;
    }

    if (options.attributes) {
      findOptions.attributes = options.attributes;
    }

    if (options.filters) {
      findOptions.where = buildFilters(options.filters, Entity.tableName);
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
    //    if (options.id) {
    //      options = options.id;
    //    }

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

    prepareEntity(entityData);

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

    prepareEntity(entityData);

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

  // helper methods

  function prepareEntity(entity) {

    Util.Collection.each(entity, function (value, key) {
      if (['dateOfBirth'].indexOf(key) != -1) {
        entity[key] = ConvertUtil.DateTime.toMySqlDate(value);
      }
    });

  }

  function buildSort(sort, tableName) {
    sort.field = buildColumnName(sort.field, tableName);

    var sort = sort.field + ' ' + sort.order;

    return sort
  }

  function buildFilters(filters, tableName) {
    var whereSql = [];
    var whereData = [];

    for (var i = 0, len = filters.length; i < len; i++) {
      var filter = filters[i];

      if (!filter.field || !filter.value) continue;

      var columnName = buildColumnName(filter.field, tableName);

      // convert to search datetime
      if (['dateOfBirth'].indexOf(filter.field) != -1) {
        filter.value = convertToSearchDateTime(filter.value);
      }

      if (['gender'].indexOf(filter.field) != -1) {
        // find exact
        whereSql.push(columnName + ' = ?');
        whereData.push(filter.value);
      } else {
        // find like
        whereSql.push(columnName + ' LIKE ?');
        whereData.push('%' + filter.value + '%');
      }
    }

    var where = [whereSql.join(' AND ')].concat(whereData);

    return where;
  }

  function buildColumnName(columnName, tableName) {
    var columnNameTokens = columnName.split('.');

    columnName = [];

    if (columnNameTokens.length == 1) {
      columnNameTokens = [tableName].concat(columnNameTokens);
    } else {
      columnNameTokens = [columnNameTokens.slice(0, -1).join('.')].concat(columnNameTokens.slice(-1));
    }

    for (var i = 0, len = columnNameTokens.length; i < len; i++) {
      columnName.push('`' + columnNameTokens[i] + '`');
    }

    return columnName.join('.');
  }

  function convertToSearchDateTime(date) {
    if (date.indexOf('/') == -1) return date;

    var dateParts = date.split('/');

    if (dateParts.length == 2) {
      return dateParts[1].trim() + '%-%' + dateParts[0].trim()
    } else {
      return dateParts[2].trim() + '%-%' + dateParts[1].trim() + '%-%' + dateParts[0].trim()
    }
  }

});
