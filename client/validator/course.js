/*
 * System          : 3connected
 * Component       : Course validator
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */

define('validator.rule.Course', function (module, require) {

  var ruleCourseId = {
    // validate for courseId
    attribute: 'courseId',
    attributeName: 'course.courseId',
    rules: [
      {
        // courseId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleCourseName = {
    // validate for courseName
    attribute: 'courseName',
    attributeName: 'course.courseName',
    rules: [
      {
        // courseName is required
        rule: 'required'
      }
    ]
  };

  var ruleNumberOfCreadits = {
    // validate for courseName
    attribute: 'numberOfCredits',
    attributeName: 'course.numberOfCredits',
    rules: [
      {
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }, {
        rule: 'min',
        ruleData: {
          min: 1
        }
      }
    ]
  };


  var ruleLectureId = {
    // validate for courseName
    attribute: 'lectureId',
    attributeName: 'course.lectureId',
    rules: [
      {
        // courseName is required
        rule: 'required'
      }
    ]
  };

  var ruleMajorId = {
    // validate for courseName
    attribute: 'majorId',
    attributeName: 'course.majorId',
    rules: [
      {
        // courseName is required
        rule: 'required'
      }
    ]
  };

  var ruleTermId = {
    // validate for courseName
    attribute: 'termId',
    attributeName: 'course.termId',
    rules: [
      {
        // courseName is required
        rule: 'required'
      }
    ]
  };

  var ruleSubject = {
    // validate for courseName
    attribute: 'subjectId',
    attributeName: 'course.subjectId',
    rules: [
      {
        // courseName is required
        rule: 'required'
      }
    ]
  };

  var ruleSubjectVersionId = {
    // validate for courseName
    attribute: 'subjectVersionId',
    attributeName: 'course.subjectVersionId',
    rules: [
      {
        // courseName is required
        rule: 'required'
      }
    ]
  };

  var ruleCreateCourse = [
    ruleCourseName,
    ruleNumberOfCreadits,
    ruleLectureId,
    ruleMajorId,
    ruleTermId,
    ruleSubject,
    ruleSubjectVersionId
  ];

  var ruleUpdateCourse = [
    ruleCourseId,
  ].concat(ruleCreateCourse);

  var ruleCourse = {
    create: ruleCreateCourse,
    update: ruleUpdateCourse
  };

  module.exports = ruleCourse;
});
