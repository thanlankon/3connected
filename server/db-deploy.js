define('db.Deploy', function (module, require) {

  var Entity = require('core.model.Entity');
  var Util = require('core.util.Util');

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

    seedStudent(queryChainer);

    seedSubject(queryChainer);
    seedSubjectVersion(queryChainer);
    seedGradeCategory(queryChainer);

    seedCourse(queryChainer);

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
            majorName: 'Major ' + i,
            batchId: i
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

  function seedStudent(queryChainer) {
    var Student = require('model.entity.Student');
    var Moment = require('lib.Moment');

    for (var i = 1; i <= 50; i++) {
      queryChainer
        .add(
          Student.create({
            studentCode: 'SE01' + i,
            firstName: 'Firstname ' + i,
            lastName: 'LastName ' + i,
            classId: 1,
            gender: 1,
            dateOfBirth: Moment.utc([1992, 9, 27]).toDate(),
            address: 'Address ' + i,
            email: 'Email.' + i + '@local.host'
          }))
        .add(
          Student.create({
            studentCode: 'SE02' + i,
            firstName: 'Firstname ' + i,
            lastName: 'LastName ' + i,
            classId: 2,
            gender: 2,
            dateOfBirth: Moment.utc([1991, 03, 16]).toDate(),
            address: 'Address ' + i,
            email: 'Email.' + i + '@local.host'
          }))
        .add(
          Student.create({
            studentCode: 'SE03' + i,
            firstName: 'Firstname ' + i,
            lastName: 'LastName ' + i,
            classId: 3,
            gender: 0,
            dateOfBirth: Moment.utc([1991, 03, 16]).toDate(),
            address: 'Address ' + i,
            email: 'Email.' + i + '@local.host'
          }))
    }
  }

  function seedSubject(queryChainer) {
    var Subject = require('model.entity.Subject');

    for (var i = 1; i <= 10; i++) {
      queryChainer
        .add(
          Subject.create({
            subjectCode: 'SJC' + i,
            subjectName: 'Subject name ' + i,
            numberOfCredits: i
          }))
    }
  }

  function seedSubjectVersion(queryChainer) {
    var SubjectVersion = require('model.entity.SubjectVersion');

    queryChainer
      .add(
        SubjectVersion.create({
          subjectId: 1,
          description: 'Test subject version'
        }))
    queryChainer
      .add(
        SubjectVersion.create({
          subjectId: 3,
          description: 'Test subject version 2'
        }))
  }

  function seedGradeCategory(queryChainer) {
    var GradeCategory = require('model.entity.GradeCategory');

//    queryChainer
//      .add(
//        GradeCategory.create({
//          subjectVersionId: 1,
//          gradeCategoryCode: 'PR',
//          gradeCategoryName: 'Progress test 1',
//          weight: 20
//        }))
  }


  function seedCourse(queryChainer) {
    var Course = require('model.entity.Course');

    queryChainer
      .add(
        Course.create({
          subjectVersionId: 1,
          termId: 1,
          majorId: 1,
          classId: 1,
          courseName: 'abc',
          numberOfCredits: 1
        }))
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
