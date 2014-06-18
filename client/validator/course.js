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

  var ruleCreateCourse = [
    ruleCourseName
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
