/*
 * System          : 3connected
 * Component       : Course Student service
 * Creator         : UayLU
 * Modifier        :ThanhVM
 * Created date    : 2014/19/06
 */
define.service('service.CourseStudent', function (service, require, ServiceUtil, Util) {

  var StudentModel = require('model.Student');
  var CourseModel = require('model.Course');
  var CourseStudentModel = require('model.CourseStudent');
  var SubjectModel = require('model.Subject');
  var SubjectVersionModel = require('model.SubjectVersion');
  var TermModel = require('model.Term');
  var MajorModel = require('model.Major');
  var ClassModel = require('model.Class');
  var BatchModel = require('model.Batch');



  service.map = {
    url: '/courseStudent',
    authorize: function (req, authentication, Role, commit) {
      // check for staff
      var authorized = Role.isStaff(authentication.accountRole);
      if (authorized) {
        commit(authorized);
        return;
      }

      commit(false);
    },

    methods: {
      addStudents: {
        authorize: function (req, authentication, Role, commit) {
          var authorized = Role.isEducator(authentication.accountRole);
          commit(authorized);
        },
        url: '/addStudents',
        httpMethod: 'POST'
      },
      removeStudents: {
        authorize: function (req, authentication, Role, commit) {
          var authorized = Role.isEducator(authentication.accountRole);
          commit(authorized);
        },
        url: '/removeStudents',
        httpMethod: 'POST'
      }
    }
  };

  service.Model = CourseStudentModel;

  service.methodConfig = {
    idAttribute: 'courseStudentId',

    message: {
      entityName: 'courseStudent',
      displayAttribute: 'courseStudent'
    },

    findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: StudentModel,
          as: 'student',
          include: [{
            model: ClassModel,
            as: 'class',
            include: [{
              model: BatchModel,
              as: 'batch'
            }, {
              model: MajorModel,
              as: 'major'
            }]
          }]
        }, {
          model: CourseModel,
          as: 'course'
        }];
      }
    },

    create: {
      attributes: ['courseId', 'studentId']
    },

    update: {
      attributes: ['courseId', 'studentId'],
      checkExistanceAttributes: ['courseStudentId']
    },

    findOne: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: StudentModel,
          as: 'student',
          include: [{
            model: ClassModel,
            as: 'class',
            include: [{
              model: BatchModel,
              as: 'batch'
              }, {
              model: MajorModel,
              as: 'major'
            }]
          }]
        }, {
          model: CourseModel,
          as: 'course',
          include: [{
            model: SubjectVersionModel,
            as: 'subjectVersion',
            include: [{
              model: SubjectModel,
              as: 'subject'
              }]
          }, {
            model: MajorModel,
            as: 'major'
          }, {
            model: TermModel,
            as: 'term'
          }]
        }];
      }
    },

  };

  service.addStudents = function (req, res) {
    var courseId = req.body.courseId;
    var studentIds = req.body.studentIds;

    CourseStudentModel.addStudents(courseId, studentIds, function (error) {
      var message;

      if (error) {
        message = 'course.addStudents.error';
      } else {
        message = 'course.addStudents.success';
      }

      ServiceUtil.sendServiceResponse(res, error, message);
    });
  };

  service.removeStudents = function (req, res) {
    var courseStudentIds = req.body.courseStudentIds;

    CourseStudentModel.removeStudents(courseStudentIds, function (error, affectedRows) {
      var message;

      if (error) {
        message = 'course.removeStudents.error';
      } else {
        if (affectedRows !== courseStudentIds.length) {
          error = {
            code: 'ENTITY.COURSE.REMOVE_STUDENT_INCOMPLETED'
          };

          message = 'course.removeStudents.incomplete';
        } else {
          message = 'course.removeStudents.success';
        }
      }

      ServiceUtil.sendServiceResponse(res, error, message);
    });
  };
});
