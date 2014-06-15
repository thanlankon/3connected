define('db.Deploy', function (module, require) {

  var Entity = require('core.model.Entity');

  module.exports = deployDb;

  function deployDb(callback) {
    deploySchema(callback);
  }

  function dbSeed(callback) {
    var queryChainer = Entity.queryChainer();

    seedBatch(queryChainer);
    seedMajor(queryChainer);
    seedTerm(queryChainer);

    seedClass(queryChainer);

    queryChainer
      .runSerially()
      .success(function () {
        console.log('Db data deployed');

        callback();
      });
  };

  function seedBatch(queryChainer) {
    var Batch = require('model.entity.Batch');

    for (var i = 1; i <= 10; i++) {
      queryChainer
        .add(
          Batch.create({
            batchName: 'Khóa ' + i + ' A'
          }))
        .add(
          Batch.create({
            batchName: 'Khóa ' + i + ' B'
          }))
        .add(
          Batch.create({
            batchName: 'Khóa ' + i + ' C'
          }))
    }
  }

  function seedTerm(queryChainer) {
    var Term = require('model.entity.Term');

    for (var i = 1; i <= 10; i++) {
      queryChainer
        .add(
          Term.create({
            termName: 'Spring ' + i
          }))
    }
  }

  function seedMajor(queryChainer) {
    var Major = require('model.entity.Major');

    for (var i = 1; i <= 10; i++) {
      queryChainer
        .add(
          Major.create({
            majorName: 'Major ' + i
          }))
    }
  }

  function seedClass(queryChainer) {
    var Class = require('model.entity.Class');

    for (var i = 1; i <= 10; i++) {
      queryChainer
        .add(
          Class.create({
            className: 'SE' + i,
            batchId: 1,
            majorId: 1
          }))
        .add(
          Class.create({
            className: 'PC' + i,
            batchId: 2,
            majorId: 1
          }))
    }
  }

  function deploySchema(callback) {
    Entity
      .query('SET FOREIGN_KEY_CHECKS = 0')
      .then(function () {
        return Entity.sync({
          force: true
        });
      })
      .then(function () {
        return Entity.query('SET FOREIGN_KEY_CHECKS = 1');
      })
      .then(function () {
        // resolve entity associations
        require('core.model.entity.EntityContainer').resoleAssociations();

        dbSeed(callback);

        console.log('Server started at port:', 80);
      }, function (error) {
        console.error('Db error: ', error);
      });
  }

});
