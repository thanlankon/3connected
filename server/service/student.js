define.service('service.Student', function (service, require, ServiceUtil, Util) {

  var StudentModel = require('model.Student');
  var ClassModel = require('model.Class');
  var BatchModel = require('model.Batch');
  var MajorModel = require('model.Major');

  service.map = {
    url: '/student',
    authorize: function (req, authentication, Role, commit) {
      // check for staff
      var authorized = Role.isAdministrator(authentication.accountRole);
      if (authorized) {
        commit(authorized);
        return;
      }

      var authorized = Role.isEducator(authentication.accountRole);
      if (authorized) {
        commit(authorized);
        return;
      }
      commit(false);

    },

    methods: {
      findOne: {
        authorize: function (req, authentication, Role, commit) {
          var authorized = Role.isAdministrator(authentication.accountRole);
          if (authorized) {
            commit(authorized);
            return;
          }

          var authorized = Role.isEducator(authentication.accountRole);
          if (authorized) {
            commit(authorized);
            return;
          }

          // check for student or parent
          var authorized = Role.isStudentOrParent(authentication.accountRole);
          if (authorized) {
            req.query.studentId = authentication.userInformationId;
            commit(true);
            return;
          }

          commit(false);
        }
      },
      destroy: {
        authorize: function (req, authentication, Role, commit) {
          var authorized = Role.isAdministrator(authentication.accountRole);
          if (authorized) {
            commit(authorized);
            return;
          }

          var authorized = Role.isEducator(authentication.accountRole);
          if (authorized) {
            commit(authorized);
            return;
          }

          commit(false);
        }
      },

      importStudent: {
        url: '/import',
        httpMethod: 'POST',
        authorize: function (req, authentication, Role, commit) {
          var authorized = Role.isAdministrator(authentication.accountRole);
          if (authorized) {
            commit(authorized);
            return;
          }

          var authorized = Role.isEducator(authentication.accountRole);
          if (authorized) {
            commit(authorized);
            return;
          }

          commit(false);
        }
      }
    }
  };

  service.Model = StudentModel;

  service.methodConfig = {
    idAttribute: 'studentId',

    message: {
      entityName: 'student',
      displayAttribute: 'studentName'
    },

    findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: ClassModel,
          as: 'class',
          include: [{
            model: BatchModel,
            as: 'batch'
          }, {
            model: MajorModel,
            as: 'major'
          }]
        }];
      }
    },

    findOne: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: ClassModel,
          as: 'class',
          include: [{
            model: BatchModel,
            as: 'batch'
          }, {
            model: MajorModel,
            as: 'major'
          }]
        }];
      }
    },

    create: {
      attributes: [
        'studentCode',
        'firstName',
        'lastName',
        'gender',
        'dateOfBirth',
        'address',
        'email',
        'classId'
      ],
      checkDuplicatedAttributes: ['studentCode']
    },

    update: {
      attributes: [
        'studentId',
        'firstName',
        'lastName',
        'gender',
        'dateOfBirth',
        'address',
        'email',
        'classId'
      ],
      checkExistanceAttributes: ['studentId'],
      checkDuplicatedAttributes: ['studentCode']
    }
  };

  service.importStudent = function (req, res) {
    var students = req.body.students || [];

    var serviceResponse = {
      error: null,
      message: null
    };

    StudentModel.importStudent(students, function (error) {
      if (error) {
        serviceResponse.message = 'student.import.error.unknown';
        serviceResponse.error = error;
      } else {
        serviceResponse.message = 'student.import.success';
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message);
    });
  }

});
