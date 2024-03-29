define('db.seed.DbSeeder', function (module, require) {

  module.exports = {
    seed: seedDb
  }

  function seedDb(queryChainer) {

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

    seedGrade(queryChainer);

    seedNewsCategory(queryChainer);
    //seedNews(queryChainer);

    seedAccount(queryChainer);

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

    queryChainer
      .add(
        Department, 'create', [{
          departmentId: 1,
          departmentName: 'Administrative Department'
          }])
      .add(
        Department, 'create', [{
          departmentId: 2,
          departmentName: 'Libary Department'
          }])
      .add(
        Department, 'create', [{
          departmentId: 3,
          departmentName: 'Education Department'
          }])
      .add(
        Department, 'create', [{
          departmentId: 4,
          departmentName: 'Examination Department'
          }])
      .add(
        Department, 'create', [{
          departmentId: 5,
          departmentName: 'Teaching Department'
          }])
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
      .add(
        Student, 'create', [{
          studentCode: 'SE90050',
          firstName: 'Trọng',
          lastName: 'Nguyễn Đức',
          classId: 1,
          gender: 1,
          dateOfBirth: ConvertUtil.DateTime.formatDate(new Date(1992, 3, 16)),
          address: 'Quảng Nam',
          email: 'trongndse90050@fpt.edu.vn'
          }])
  }

  function seedStaff(queryChainer) {
    var Staff = require('model.entity.Staff');
    var Moment = require('lib.Moment');
    var ConvertUtil = require('core.util.ConvertUtil');
    queryChainer
      .add(
        Staff, 'create', [{
          staffCode: 'thytt',
          firstName: 'Thy',
          lastName: 'Trương Thị',
          staffRole: 4,
          departmentId: 2,
          gender: 1,
          dateOfBirth: ConvertUtil.DateTime.formatDate(new Date(1982, 3, 16)),
          address: 'Đà Nẵng',
          email: 'thytt@fpt.edu.vn'
          }])
      .add(
        Staff, 'create', [{
          staffCode: 'anhnn4',
          firstName: 'Anh',
          lastName: 'Nguyễn Ngọc ',
          staffRole: 7,
          departmentId: 5,
          gender: 2,
          dateOfBirth: ConvertUtil.DateTime.formatDate(new Date(1981, 3, 16)),
          address: 'Đà Nẵng',
          email: 'anhnn4@fpt.edu.vn'
          }])
      .add(
        Staff, 'create', [{
          staffCode: 'haitt',
          firstName: 'Hải',
          lastName: 'Tô Thanh ',
          staffRole: 7,
          departmentId: 5,
          gender: 2,
          dateOfBirth: ConvertUtil.DateTime.formatDate(new Date(1982, 5, 11)),
          address: 'Đà Nẵng',
          email: 'haitt@fpt.edu.vn'
          }])
      .add(
        Staff, 'create', [{
          staffCode: 'mailtt',
          firstName: 'Mai',
          lastName: 'Lê Thị Trúc',
          departmentId: 3,
          gender: 1,
          dateOfBirth: ConvertUtil.DateTime.formatDate(new Date(1982, 9, 27)),
          address: 'Quảng Nam',
          email: 'mailtt@fpt.edu.vn'
          }])
      .add(
        Staff, 'create', [{
          staffCode: 'hoangtv',
          firstName: 'Hoàng',
          lastName: 'Trần Văn',
          departmentId: 2,
          gender: 1,
          dateOfBirth: ConvertUtil.DateTime.formatDate(new Date(1982, 9, 27)),
          address: 'Quảng Nam',
          email: 'mailtt@fpt.edu.vn'
          }])
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
      .add(
        Subject, 'create', [{
          subjectCode: 'PRM391',
          subjectName: 'Programming Mobile',
          numberOfCredits: 3
          }])
      .add(
        Subject, 'create', [{
          subjectCode: 'JPS141',
          subjectName: 'Japanese 4',
          numberOfCredits: 3
          }])
      .add(
        Subject, 'create', [{
          subjectCode: 'ISC301',
          subjectName: 'E-Commerce',
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
          subjectId: 2,
          description: 'Ver 1.0'
        }])
    queryChainer
      .add(
        SubjectVersion, 'create', [{
          subjectId: 3,
          description: 'Ver 1.0'
        }])
    queryChainer
      .add(
        SubjectVersion, 'create', [{
          subjectId: 4,
          description: 'Ver 1.0'
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
          numberOfCredits: 3
        }])
      .add(
        Course, 'create', [{
          subjectVersionId: 2,
          termId: 1,
          majorId: 1,
          classId: 1,
          courseName: 'PRM391 - SE0601',
          numberOfCredits: 3
        }])
      .add(
        Course, 'create', [{
          subjectVersionId: 3,
          termId: 1,
          majorId: 1,
          classId: 1,
          courseName: 'JPS141 - SE0601',
          numberOfCredits: 3
        }])
      .add(
        Course, 'create', [{
          subjectVersionId: 4,
          termId: 1,
          majorId: 1,
          classId: 1,
          courseName: 'ISC301 - SE0601',
          numberOfCredits: 3
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
      .add(
        CourseStudent, 'create', [{
          courseId: 1,
          studentId: 2
        }])
      .add(
        CourseStudent, 'create', [{
          courseId: 1,
          studentId: 3
        }])
      .add(
        CourseStudent, 'create', [{
          courseId: 2,
          studentId: 1
        }])
      .add(
        CourseStudent, 'create', [{
          courseId: 2,
          studentId: 2
        }])
      .add(
        CourseStudent, 'create', [{
          courseId: 2,
          studentId: 3
        }])
      .add(
        CourseStudent, 'create', [{
          courseId: 3,
          studentId: 1
        }])
      .add(
        CourseStudent, 'create', [{
          courseId: 3,
          studentId: 2
        }])
      .add(
        CourseStudent, 'create', [{
          courseId: 3,
          studentId: 3
        }])
      .add(
        CourseStudent, 'create', [{
          courseId: 4,
          studentId: 1
        }])
      .add(
        CourseStudent, 'create', [{
          courseId: 4,
          studentId: 2
        }])
      .add(
        CourseStudent, 'create', [{
          courseId: 4,
          studentId: 3
        }])
  }

  function seedGrade(queryChainer) {
    var Grade = require('model.entity.Grade');

    queryChainer
      .add(
        Grade, 'create', [{
          courseId: 1,
          gradeCategoryId: 1,
          studentId: 1,
          value: 8
        }])
  }

  function seedNewsCategory(queryChainer) {
    var NewsCategory = require('model.entity.NewsCategory');

    queryChainer
      .add(
        NewsCategory, 'create', [{
          newsCategoryName: 'Exam Schedule',
          parentCategoryId: null,
        }])
      .add(
        NewsCategory, 'create', [{
          newsCategoryName: 'Subject Schedule',
          parentCategoryId: 1,
        }])
  }

  function seedNews(queryChainer) {
    var News = require('model.entity.News');
    var CategoryOfNews = require('model.entity.CategoryOfNews');

    queryChainer
      .add(
        News, 'create', [{
          title: 'Exam',
          content: 'Exam Scheduler',
          authorId: 1,
        }])
      .add(
        CategoryOfNews, 'create', [{
          newsCategoryId: 1,
          newsId: 1,
        }])
  }

  function seedAccount(queryChainer) {
    var Account = require('model.entity.Account');
    var AuthenticationUtil = require('core.auth.AuthenticationUtil');

    queryChainer
      .add(
        Account, 'create', [{
          userInformationId: 1,
          role: 1,
          username: 'admin',
          password: AuthenticationUtil.encryptPassword('abc123'),
          isActive: true,
          expiredDate: '01/01/2016'
      }])
      .add(
        Account, 'create', [{
          username: 'SE90050',
          password: AuthenticationUtil.encryptPassword('abc123'),
          role: 5,
          userInformationId: 3,
          isActive: true,
          expiredDate: '01/01/2016'
        }])
      .add(
        Account, 'create', [{
          username: 'SE90075',
          password: AuthenticationUtil.encryptPassword('abc123'),
          role: 5,
          userInformationId: 2,
          isActive: true,
          expiredDate: '01/01/2016'
        }])
      .add(
        Account, 'create', [{
          userInformationId: 5,
          role: 2,
          username: 'hoangtv',
          password: AuthenticationUtil.encryptPassword('abc123'),
          isActive: true,
          expiredDate: '01/01/2016'
        }])
      .add(
        Account, 'create', [{
          userInformationId: 4,
          role: 3,
          username: 'mailtt',
          password: AuthenticationUtil.encryptPassword('abc123'),
          isActive: true,
          expiredDate: '01/01/2016'
        }])
      .add(
        Account, 'create', [{
          userInformationId: 1,
          role: 5,
          username: 'SE90059',
          password: AuthenticationUtil.encryptPassword('abc123'),
          isActive: true,
          expiredDate: '01/01/2016'
      }])
      .add(
        Account, 'create', [{
          userInformationId: 3,
          role: 7,
          username: 'haitt',
          password: AuthenticationUtil.encryptPassword('abc123'),
          isActive: true,
          expiredDate: '01/01/2016'
      }]).add(
        Account, 'create', [{
          userInformationId: 2,
          role: 7,
          username: 'anhnn4',
          password: AuthenticationUtil.encryptPassword('abc123'),
          isActive: true,
          expiredDate: '01/01/2016'
      }])
  }

});
