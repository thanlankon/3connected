/*
 * System          : 3connected
 * Component       : Grade Category Model
 * Creator         : UayLu
 * Created date    : 2014/17/06
 */
define.model('model.GradeCategory', function (model, ModelUtil, require) {

  var GradeCategory = require('model.entity.GradeCategory');
  var SubjectVersion = require('model.entity.SubjectVersion');
  var Subject = require('model.entity.Subject');


  model.Entity = GradeCategory;

  model.getSubjectVersionGradeCaterogy = function (subjectVersionId, callback) {

    // find the Course
    GradeCategory.findAll({
      include: [{
        model: SubjectVersion,
        as: 'subjectVersion',
        where: {
          subjectVersionId: subjectVersionId
        },
        include: [{
          model: Subject,
          as: 'subject'
          }]
      }]

    })
      .success(function (gradeCategory) {
        callback(null, gradeCategory, false);
      })
      .error(function (error) {
        callback(error);
      });
  };

});
