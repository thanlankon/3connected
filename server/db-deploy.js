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
    seedDepartment(queryChainer);

    seedStudent(queryChainer);
    seedStaff(queryChainer);
    seedSubject(queryChainer);
    seedSubjectVersion(queryChainer);
    seedGradeCategory(queryChainer);

    seedCourse(queryChainer);
    seedSchedule(queryChainer);
    seedCourseStudent(queryChainer);

    queryChainer
      .runSerially()
      .success(function () {
        console.log('Db data deployed');

        callback();
      })
      .error(function (error) {
        console.log('Db seed error:', error);
      });;
  };

  function seedBatch(queryChainer) {
    var Batch = require('model.entity.Batch');

      queryChainer
        .add(
          Batch, 'create', [{
            batchName: 'Khóa 6C'
          }])
        .add(
          Batch, 'create', [{
            batchName: 'Khóa 7B'
          }])
        .add(
          Batch, 'create', [{
            batchName: 'Khóa 7C'
          }])
  }

  function seedTerm(queryChainer) {
    var Term = require('model.entity.Term');

      queryChainer
        .add(
          Term, 'create', [{
            termName: 'Spring 2014'
          }])
        .add(
          Term, 'create', [{
            termName: 'Summer 2014'
          }])
        .add(
          Term, 'create', [{
            termName: 'Fall 2014'
          }])
  }

  function seedMajor(queryChainer) {
    var Major = require('model.entity.Major');

      queryChainer
        .add(
          Major, 'create', [{
            majorName: 'Software Engineering',
            batchId: 1
          }])
        .add(
          Major, 'create', [{
            majorName: 'Financial Banking',
            batchId: 1
          }])
        .add(
          Major, 'create', [{
            majorName: 'Business Administration',
            batchId: 1
          }])
  }

  function seedDepartment(queryChainer) {
    var Department = require('model.entity.Department');

    for (var i = 1; i <= 1; i++) {
      queryChainer
        .add(
          Department, 'create', [{
            departmentId: i,
            departmentName: 'Department ' + i
          }])
    }
  }

  function seedClass(queryChainer) {
    var Class = require('model.entity.Class');

      queryChainer
        .add(
          Class, 'create', [{
            className: 'SE0601',
            batchId: 1,
            majorId: 1
          }])
  }

  function seedStudent(queryChainer) {
    var Student = require('model.entity.Student');
    var ConvertUtil = require('core.util.ConvertUtil');

      queryChainer
        .add(
          Student, 'create', [{
            studentCode: 'SE90059',
            firstName: 'Thành',
            lastName: 'Võ Minh',
            classId: 1,
            gender: 1,
            dateOfBirth: ConvertUtil.DateTime.formatDate(new Date(1992, 6, 29)),
            address: 'Đà Nẵng',
            email: 'thanhvmse90059@fpt.edu.vn'
          }])
        .add(
          Student, 'create', [{
            studentCode: 'SE90075',
            firstName: 'Dung',
            lastName: 'Nguyễn Vương Hoàng',
            classId: 1,
            gender: 2,
            dateOfBirth: ConvertUtil.DateTime.formatDate(new Date(1992, 3, 16)),
            address: 'Hội An',
            email: 'dungnvhse90075@fpt.edu.vn'
          }])
  }

  function seedStaff(queryChainer) {
    var Staff = require('model.entity.Staff');
    var Moment = require('lib.Moment');

    for (var i = 1; i <= 1; i++) {
      queryChainer
        .add(
          Staff, 'create', [{
            firstName: 'Firstname ' + i,
            lastName: 'LastName ' + i,
            departmentId: 1,
            gender: 1,
            dateOfBirth: Moment.utc([1992, 9, 27]).toDate(),
            address: 'Address ' + i,
            email: 'Email.' + i + '@local.host'
          }])
        .add(
          Staff, 'create', [{
            firstName: 'Firstname ' + i,
            lastName: 'LastName ' + i,
            departmentId: 1,
            gender: 2,
            dateOfBirth: Moment.utc([1991, 03, 16]).toDate(),
            address: 'Address ' + i,
            email: 'Email.' + i + '@local.host'
          }])
        .add(
          Staff, 'create', [{
            firstName: 'Firstname ' + i,
            lastName: 'LastName ' + i,
            departmentId: 1,
            gender: 0,
            dateOfBirth: Moment.utc([1991, 03, 16]).toDate(),
            address: 'Address ' + i,
            email: 'Email.' + i + '@local.host'
          }])
    }
  }

  function seedSubject(queryChainer) {
    var Subject = require('model.entity.Subject');

      queryChainer
        .add(
          Subject, 'create', [{
            subjectCode: 'PRC391',
            subjectName: 'Cloud Computing',
            numberOfCredits: 3
          }])
  }

  function seedSubjectVersion(queryChainer) {
    var SubjectVersion = require('model.entity.SubjectVersion');

    queryChainer
      .add(
        SubjectVersion, 'create', [{
          subjectId: 1,
          description: 'Ver 1.0'
        }])
    queryChainer
      .add(
        SubjectVersion, 'create', [{
          subjectId: 1,
          description: 'Ver 1.1'
        }])
  }

  function seedGradeCategory(queryChainer) {
    var GradeCategory = require('model.entity.GradeCategory');

    queryChainer
      .add(
        GradeCategory, 'create', [{
          subjectVersionId: 1,
          gradeCategoryCode: 'PT',
          gradeCategoryName: 'Progress Test',
          weight: 20
        }])
      .add(
        GradeCategory, 'create', [{
          subjectVersionId: 1,
          gradeCategoryCode: 'PE',
          gradeCategoryName: 'Practical Exam',
          weight: 30
        }])
      .add(
        GradeCategory, 'create', [{
          subjectVersionId: 1,
          gradeCategoryCode: 'FE',
          gradeCategoryName: 'Final Exam',
          weight: 50
        }])
  }

  function seedCourse(queryChainer) {
    var Course = require('model.entity.Course');

    queryChainer
      .add(
        Course, 'create', [{
          subjectVersionId: 1,
          termId: 1,
          majorId: 1,
          classId: 1,
          courseName: 'PRC391 - SE0601',
          numberOfCredits: 1
        }])
  }

  function seedSchedule(queryChainer) {
    var Schedule = require('model.entity.Schedule');

    queryChainer
      .add(
        Schedule, 'create', [{
          courseId: 1,
          date: '27/05/2014',
          slot: 1
        }])
      .add(
        Schedule, 'create', [{
          courseId: 1,
          date: '28/05/2014',
          slot: 1
        }])
      .add(
        Schedule, 'create', [{
          courseId: 1,
          date: '28/05/2014',
          slot: 2
        }])
      .add(
        Schedule, 'create', [{
          courseId: 1,
          date: '29/05/2014',
          slot: 2
        }])
      .add(
        Schedule, 'create', [{
          courseId: 1,
          date: '29/05/2014',
          slot: 3
        }])
      .add(
        Schedule, 'create', [{
          courseId: 1,
          date: '30/05/2014',
          slot: 3
        }])
      .add(
        Schedule, 'create', [{
          courseId: 1,
          date: '31/05/2014',
          slot: 4
        }])
  }

  function seedCourseStudent(queryChainer) {
    var CourseStudent = require('model.entity.CourseStudent');

      queryChainer
        .add(
          CourseStudent, 'create', [{
            courseId: 1,
            studentId: 1
          }])
  }

  function deploySchema(callback) {
    var syncDb = (process.argv[2] == 'sync-db' || process.argv[3] == 'sync-db');

    if (!syncDb) {
      require('core.model.entity.EntityContainer').resoleAssociations();

      callback();

      return;
    }

    Entity
      .query('SET FOREIGN_KEY_CHECKS = 0')
      .then(function () {
        return Entity.sync({
          force: syncDb
        });
      })
      .then(function () {
        return Entity.query('SET FOREIGN_KEY_CHECKS = 1');
      })
      .then(function () {
        // resolve entity associations
        require('core.model.entity.EntityContainer').resoleAssociations();

        dbSeed(callback);
      }, function (error) {
        console.error('Db error: ', error);
      });
  }

});
