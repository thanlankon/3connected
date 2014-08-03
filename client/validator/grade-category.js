define('validator.rule.GradeCategory', function (module, require) {

  var ruleGradeCategoryId = {
    // validate for grade category id
    attribute: 'gradeCategoryId',
    attributeName: 'gradeCategory.gradeCategoryId',
    rules: [
      {
        // GradeCategoryId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleMinimumGrade = {
    // validate for grade category id
    attribute: 'minimumGrade',
    attributeName: 'gradeCategory.minimumGrade',
    rules: [
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleGradeCategoryCode = {
    // validate for grade category code
    attribute: 'gradeCategoryCode',
    attributeName: 'gradeCategory.gradeCategoryCode',
    rules: [
      {
        // grade-categoryCode is required
        rule: 'required'
      },
      {
        // grade-categoryCode max len is 20
        rule: 'maxLength',
        ruleData: {
          maxLength: 20
        }
      }
     ]
  };

  var ruleGradeCategoryName = {
    // validate for grade category name
    attribute: 'gradeCategoryName',
    attributeName: 'gradeCategory.gradeCategoryName',
    rules: [
      {
        // GradeCategoryName is required
        rule: 'required'
      },
      {
        // GradeCategoryName max length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
     ]
  };


  var ruleMinimumGrade = {
    // validate for weight
    attribute: 'minimumGrade',
    attributeName: 'gradeCategory.minimumGrade',
    rules: [
      {
        rule: 'positiveInteger'
      }, {
        rule: 'min',
        ruleData: {
          min: 0
        }
      },
      {
        rule: 'max',
        ruleData: {
          max: 10
        }
      }
     ]
  };


  var ruleWeight = {
    // validate for weight
    attribute: 'weight',
    attributeName: 'gradeCategory.weight',
    rules: [
      {
        // weight is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }, {
        rule: 'min',
        ruleData: {
          min: 0
        }
      },
      {
        rule: 'max',
        ruleData: {
          max: 100
        }
      }
     ]
  };

  var ruleSubjectVersionId = {
    // validate for subject version id
    attribute: 'subjectVersionId',
    attributeName: 'subject.subjectVersionId',
    rules: [
      {
        // subjectVersionId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };


  var ruleCreateGradeCategory = [
    ruleSubjectVersionId,
    ruleGradeCategoryCode,
    ruleGradeCategoryName,
    ruleGradeCategoryName,
    ruleMinimumGrade,
    ruleWeight

  ];

  var ruleUpdateGradeCategory = [
    ruleGradeCategoryId,
  ].concat(ruleCreateGradeCategory);

  var ruleGradeCategory = {
    create: ruleCreateGradeCategory,
    update: ruleUpdateGradeCategory
  };

  module.exports = ruleGradeCategory;

});
