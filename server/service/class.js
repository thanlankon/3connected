define.service('service.Class', function (service, require, ServiceUtil, Util) {

  var ClassModel = require('model.Class');
  var BatchModel = require('model.Batch');
  var MajorModel = require('model.Major');

  service.map = {
    url: '/class',

    authorize: function (req, authentication, Role, commit) {
      // check for staff
      var authorized = Role.isEducator(authentication.accountRole);
      if (authorized) {
        commit(authorized);
        return;
      }

      commit(false);
    },

    methods: {
      addStudents: {
        url: '/addStudents',
        httpMethod: 'POST'
      },
      removeStudents: {
        url: '/removeStudents',
        httpMethod: 'POST'
      },
      findAll: {
        authorize: function (req, authentication, Role, commit) {
          var authorized = Role.isEducator(authentication.accountRole);
          if (authorized) {
            commit(authorized);
            return;
          }

          // check for student or parent
          var authorized = Role.isAdministrator(authentication.accountRole);
          if (authorized) {
            req.query.studentId = authentication.userInformationId;
            commit(true);
            return;
          }

          commit(false);
        }
      }
    }
  };

  service.Model = ClassModel;

  service.methodConfig = {
    idAttribute: 'classId',

    message: {
      entityName: 'class',
      displayAttribute: 'className'
    },

    findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: BatchModel,
          as: 'batch'
        }, {
          model: MajorModel,
          as: 'major'
        }];
      }
    },

    create: {
      attributes: ['className', 'batchId', 'majorId'],
      checkDuplicatedAttributes: ['className']
    },

    update: {
      attributes: ['className', 'batchId', 'majorId'],
      checkExistanceAttributes: ['classId'],
      checkDuplicatedAttributes: ['className']
    }
  };

  // for class students

  service.addStudents = function (req, res) {
    var classId = req.body.classId;
    var studentIds = req.body.studentIds;

    ClassModel.addStudents(classId, studentIds, function (error, affectedRows) {
      var message;

      if (error) {
        message = 'class.addStudents.error';
      } else {
        if (affectedRows !== studentIds.length) {
          error = {
            code: 'ENTITY.CLASS.ADD_STUDENT_INCOMPLETED'
          };

          message = 'class.addStudents.incomplete';
        } else {
          message = 'class.addStudents.success';
        }
      }

      ServiceUtil.sendServiceResponse(res, error, message);
    });
  };

  service.removeStudents = function (req, res) {
    var classId = req.body.classId;
    var studentIds = req.body.studentIds;

    ClassModel.removeStudents(classId, studentIds, function (error, affectedRows) {
      var message;

      if (error) {
        message = 'class.removeStudents.error';
      } else {
        if (affectedRows !== studentIds.length) {
          error = {
            code: 'ENTITY.CLASS.REMOVE_STUDENT_INCOMPLETED'
          };

          message = 'class.removeStudents.incomplete';
        } else {
          message = 'class.removeStudents.success';
        }
      }

      ServiceUtil.sendServiceResponse(res, error, message);
    });
  };

});
