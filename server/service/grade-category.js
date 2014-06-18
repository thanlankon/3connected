define.service('service.GradeCategory', function (service, require, ServiceUtil, Util) {

  var SubjectModel = require('model.Subject');
  var SubjectVersionModel = require('model.SubjectVersion');
  var GradeCategoryModel = require('model.GradeCategory');

  service.map = {
    url: '/gradeCategory'
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
      attributes: ['subjectVersionId', 'gradeCategoryCode', 'gradeCategoryName', 'gradeCategoryName','weight']
    },

    update: {
      attributes: ['subjectVersionId', 'gradeCategoryCode', 'gradeCategoryName', 'gradeCategoryName','weight']
    }
  }

});
