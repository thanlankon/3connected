/*
 * System          : 3connected
 * Component       : Grade category service
 * Creator         : UayLu
 * Created date    : 2014/06/18
 */
define.service('service.GradeCategory', function (service, require, ServiceUtil, Util) {

  var SubjectModel = require('model.Subject');
  var SubjectVersionModel = require('model.SubjectVersion');
  var GradeCategoryModel = require('model.GradeCategory');

  service.map = {
    url: '/gradeCategory',

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
      getSubjectVersionGradeCaterogy: {
        url: '/getSubjectVersionGradeCaterogy',
        httpMethod: 'GET'
      }
    }
  };




  service.Model = GradeCategoryModel;

  service.methodConfig = {
    idAttribute: 'gradeCategoryId',

    message: {
      entityName: 'gradeCategory',
      displayAttribute: 'gradeCategoryName'
    },

    findAll: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: SubjectVersionModel,
          as: 'subjectVersion',
          include: [{
            model: SubjectModel,
            as: 'subject'
          }]
        }];
      }
    },

    create: {
      attributes: ['subjectVersionId', 'gradeCategoryCode', 'gradeCategoryName', 'minimumGrade', 'weight']
    },

    update: {
      attributes: ['subjectVersionId', 'gradeCategoryCode', 'gradeCategoryName', 'minimumGrade', 'weight'],
      checkExistanceAttributes: ['gradeCategoryId', 'gradeCategoryCode']
    },

    findOne: {
      buildFindOptions: function (findOptions) {
        findOptions.include = [{
          model: SubjectVersionModel,
          as: 'subjectVersion',
          include: [{
            model: SubjectModel,
            as: 'subject'
          }]
        }];
      }
    }
  };

  service.getSubjectVersionGradeCaterogy = function (req, res) {

    var serviceResponse = {
      error: null,
      message: null,
      data: null
    };

    var subjectVersionId = 0;

    console.log(req.query.filters);
    if (req.query.filters) {
      for (var i = 0, len = req.query.filters.length; i < len; i++) {
        if (req.query.filters[i].field == 'subjectVersionId') {
          subjectVersionId = req.query.filters[i].value;
        }
      }
    }

    console.log('id' + subjectVersionId);
    GradeCategoryModel.getSubjectVersionGradeCaterogy(subjectVersionId, function (error, gradeCategory, isNotFound) {
      if (error) {
        serviceResponse.message = 'gradeCategory.getSubjectVersionGradeCaterogy.error';
        serviceResponse.error = error;
      } else {
        if (isNotFound) {
          serviceResponse.error = {
            code: 'ENTITY.NOT_FOUND'
          };
          serviceResponse.message = 'gradeCategory.getSubjectVersionGradeCaterogy.notFound';
        } else {
          serviceResponse.data = {
            items: gradeCategory,
            total: gradeCategory.length
          }
        }
      }

      ServiceUtil.sendServiceResponse(res, serviceResponse.error, serviceResponse.message, serviceResponse.data);
    });

  };

});
