/*
 * System          : 3connected
 * Component       : Grade model
 * Creator         : UayLu
 * Created date    : 2014/06/23
 */

define.model('model.Grade', function (model, ModelUtil, require) {

  var Grade = require('model.entity.Grade');
  var Student = require('model.entity.Student');
  var Course = require('model.entity.Course');
  var SubjectVersion = require('model.entity.SubjectVersion');
  var Subject = require('model.entity.Subject');
  var GradeCategory = require('model.entity.GradeCategory');
  var CourseStudent = require('model.entity.CourseStudent');
  var Entity = require('core.model.Entity');
  var GradeHistory = require('model.entity.GradeHistory');
  var Staff = require('model.entity.Staff');
  var Term = require('model.entity.Term');

  var GradeStatus = require('enum.GradeStatus');
  var GradeConstant = require('constant.Grade');
  var StatisticType = require('enum.StatisticType');

  var Util = require('core.util.Util');

  model.Entity = Grade;

  model.getCourseGrade = function (courseId, userId, callback) {

    var queryChainer = Entity.queryChainer();

    // find the Course
    Course.find({
      where: {
        courseId: courseId
      },
      include: [{
        model: CourseStudent,
        as: 'courseStudents',
        include: [{
          model: Student,
          as: 'student'
        }]
      }, {
        model: SubjectVersion,
        as: 'subjectVersion',
        include: [{
          model: Subject,
          as: 'subject'
        }, {
          model: GradeCategory,
          as: 'gradeCategories'
        }]
      }]
    })
      .success(function (course) {
        if (course == null) {
          callback(null, null, true);
          return;
        }

        if (userId != 0 && course.lectureId != userId) {
          callback(null, null, true);
          return;
        }

        // find student's grades of the course
        getGrade(course)
      })
      .error(function (error) {
        callback(error);
      });

    function getGrade(course) {
      var gradeCategories = course.subjectVersion.gradeCategories;
      var students = course.courseStudents;

      var gradeCategoryIds = [];
      for (var i = 0, len = gradeCategories.length; i < len; i++) {
        gradeCategoryIds.push(gradeCategories[i].gradeCategoryId);
      }

      var studentIds = [];
      for (var i = 0, len = students.length; i < len; i++) {
        studentIds.push(students[i].studentId);
      }

      Grade.findAll({
        where: {
          gradeCategoryId: gradeCategoryIds,
          studentId: studentIds,
          courseId: courseId
        }
      })
        .success(function (grades) {
          buildCourseGrade(course, grades);
        })
        .error(function (error) {
          callback(error);
        });

    }

    function buildCourseGrade(course, grades) {

      // course students
      var students = [];
      var courseStudents = course.courseStudents;

      for (var i = 0, len = courseStudents.length; i < len; i++) {
        var student = courseStudents[i].student;

        students.push({
          studentId: student.studentId,
          studentCode: student.studentCode,
          firstName: student.firstName,
          lastName: student.lastName
        });
      }

      // course grade categories
      var gradeCategories = [];
      var courseGradeCategories = course.subjectVersion.gradeCategories;

      for (var i = 0, len = courseGradeCategories.length; i < len; i++) {
        var gradeCategory = courseGradeCategories[i];

        gradeCategories.push({
          gradeCategoryId: gradeCategory.gradeCategoryId,
          gradeCategoryCode: gradeCategory.gradeCategoryCode,
          gradeCategoryName: gradeCategory.gradeCategoryName,
          weight: gradeCategory.weight,
          minimumGrade: gradeCategory.minimumGrade
        });
      }

      var courseGrade = {
        gradeCategories: gradeCategories,
        students: students,
        grades: grades
      };

      callback(null, courseGrade, false);

    }

  };

  model.updateCourseGrade = function (courseId, gradeData, userId, callback) {

    if (!gradeData || !gradeData.length) {
      callback(null);
      return;
    }

    console.log(gradeData);

    var grades = [];

    for (var i = 0, len = gradeData.length; i < len; i++) {
      var grade = {
        gradeId: gradeData[i].gradeId,
        courseId: courseId,
        studentId: gradeData[i].studentId,
        value: gradeData[i].value,
        gradeCategoryId: gradeData[i].gradeCategoryId
      };

      grades.push(grade);
    }

    Entity.transaction(function (transaction) {

      var findOrCreateQueryChainer = Entity.queryChainer();

      grades.forEach(function (grade) {
        var findOption;

        if (grade.gradeId) {
          findOption = {
            gradeId: gradeId
          }
        } else {
          findOption = {
            gradeCategoryId: grade.gradeCategoryId,
            studentId: grade.studentId,
            courseId: grade.courseId,
          }
        }

        findOrCreateQueryChainer.add(Grade.findOrCreate(findOption, {
          gradeCategoryId: grade.gradeCategoryId,
          studentId: grade.studentId,
          courseId: grade.courseId,
          value: grade.value
        }));

      });

      findOrCreateQueryChainer
        .run()
        .success(function (results) {
          var updateAndLogHistoryQueryChainer = Entity.queryChainer();

          results.forEach(function (grade, index) {
            var gradeData = grades[index];

            if (gradeData.gradeId) {
              // update grade status and log history
              // only if value has changed
              if (gradeData.value != grade.value) {
                var oldValue = grade.value;
                var newValue = gradeData.value;

                // update grade value
                updateAndLogHistoryQueryChainer.add(grade.updateAttributes({
                  value: newValue
                }, {
                  transaction: transaction
                }));

                // log history
                updateAndLogHistoryQueryChainer.add(GradeHistory.create({
                  gradeId: grade.gradeId,
                  staffId: userId,
                  oldValue: oldValue,
                  newValue: newValue
                }, {
                  transaction: transaction
                }));
              }
            } else {
              var oldValue = null;
              var newValue = gradeData.value;

              // log history for created grade
              updateAndLogHistoryQueryChainer.add(GradeHistory.create({
                gradeId: grade.gradeId,
                staffId: userId,
                oldValue: oldValue,
                newValue: newValue
              }, {
                transaction: transaction
              }));
            }
          });

          updateAndLogHistoryQueryChainer
            .run()
            .success(function () {
              transaction.commit();
              callback(null);
            })
            .error(function (error) {
              transaction.rollback();
              callback(error);
            });

        })
        .error(function (errors) {
          transaction.rollback();
          callback(errors);
        });

    });

  };


  model.getCourseGradeStudent = function (courseIds, studentId, callback) {

    var queryChainer = Entity.queryChainer();

    // find the Course
    Course.findAll({
      where: {
        courseId: courseIds
      },
      include: [{
        model: SubjectVersion,
        as: 'subjectVersion',
        include: [{
          model: Subject,
          as: 'subject'
        }, {
          model: GradeCategory,
          as: 'gradeCategories'
        }]
      }],
      order: 'courseId'
    })
      .success(function (course) {
        if (course == null) {
          callback(null, null, true);
          return;
        }
        // find student's grades of the course
        getGrade(course);

      })
      .error(function (error) {
        callback(error);
      });

    function getGrade(course) {
      var gradeCategoryIds = [];
      for (var j = 0, lenk = course.length; j < lenk; j++) {
        var gradeCategories = course[j].subjectVersion.gradeCategories;

        for (var i = 0, len = gradeCategories.length; i < len; i++) {
          gradeCategoryIds.push(gradeCategories[i].gradeCategoryId);
        }
      }

      Grade.findAll({
        where: {
          gradeCategoryId: gradeCategoryIds,
          studentId: studentId,
          courseId: courseIds
        }
      })
        .success(function (grades) {
          buildCourseGradeStudent(course, grades);
        })
        .error(function (error) {
          callback(error);
        });

    }

    function buildCourseGradeStudent(course, grades) {

      // course grade
      var termGradeStudent = [];
      //      var courseGradeCategories = course.subjectVersion.gradeCategories;
      var grades = grades;

      var totalCredits = 0;
      var totalGrade = 0;
      var totalCreditFail = 0;
      var resultSubject = GradeStatus.PASS;

      for (var i = 0, len = course.length; i < len; i++) {

        var courseGradeCategories = course[i].subjectVersion.gradeCategories;
        var gradeStudent = [];
        var finalSubjectGrade = 0;
        var totalWeightGradeCategory = 0;
        var isFinish = false;
        resultSubject = GradeStatus.PASS;

        for (var j = 0, lenj = courseGradeCategories.length; j < lenj; j++) {

          var gradeCategory = courseGradeCategories[j];
          var minimumGrade = gradeCategory.minimumGrade;
          totalWeightGradeCategory = totalWeightGradeCategory + parseFloat(gradeCategory.weight);
          isFinish = false;

          for (var k = 0, lenk = grades.length; k < lenk; k++) {

            var grade = grades[k];

            if (gradeCategory.gradeCategoryId == grade.gradeCategoryId && course[i].courseId == grade.courseId) {

              isFinish = true;
              if (minimumGrade > 0 && minimumGrade > grade.value) {
                resultSubject = GradeStatus.FAIL;
              }
              k = lenk - 1;
              finalSubjectGrade = finalSubjectGrade + parseFloat(gradeCategory.weight) * parseFloat(grade.value);
            }
          }

        }

        if (totalWeightGradeCategory != 0) finalSubjectGrade = finalSubjectGrade / totalWeightGradeCategory;

        totalCredits = totalCredits + parseInt(course[i].subjectVersion.subject.numberOfCredits);
        totalGrade = totalGrade + finalSubjectGrade * parseInt(course[i].subjectVersion.subject.numberOfCredits);
        finalSubjectGrade = finalSubjectGrade.toFixed(2);

        if (finalSubjectGrade < GradeConstant.PASS_GRADE) {
          resultSubject = GradeStatus.FAIL;
        }

        if (resultSubject == GradeStatus.FAIL && isFinish == true) {
          totalCreditFail = totalCreditFail + parseInt(course[i].subjectVersion.subject.numberOfCredits);
        }

        if (isFinish == false) {
          resultSubject = GradeStatus.UNFINISHED;
        }

        termGradeStudent.push({
          courseId: course[i].courseId,
          courseName: course[i].courseName,
          numberOfCredits: course[i].subjectVersion.subject.numberOfCredits,
          subjectName: course[i].subjectVersion.subject.subjectName,
          finalSubjectGrade: finalSubjectGrade,
          resultSubject: resultSubject
        });
      }

      var finalGrade = 0;

      var summaryGrade = totalGrade / totalCredits;
      summaryGrade = summaryGrade.toFixed(2);

      if (isNaN(summaryGrade)) summaryGrade = null;

      var courseGradeStudent = {
        summaryGradeStudent: termGradeStudent,
        totalCredits: totalCredits,
        totalCreditFail: totalCreditFail,
        summaryGrade: summaryGrade
      };

      callback(null, courseGradeStudent, false);

    }

  };


  model.statisticGradeStudent = function (studentId, callback) {

    var queryChainer = Entity.queryChainer();

    // find the Course
    Course.findAll({
      include: [{
        model: SubjectVersion,
        as: 'subjectVersion',
        include: [{
          model: Subject,
          as: 'subject'
        }, {
          model: GradeCategory,
          as: 'gradeCategories'
        }]
      }, {
        model: CourseStudent,
        as: 'courseStudents',
        where: {
          studentId: studentId
        }
      }, {
        model: Term,
        as: 'term',
        }],
      order: 'courseId'
    })
      .success(function (course) {
        if (course == null) {
          callback(null, null, true);
          return;
        }
        // find student's grades of the course
        getGrade(course);

      })
      .error(function (error) {
        callback(error);
      });

    function getGrade(course) {
      var gradeCategoryIds = [];
      var courseIds = [];
      for (var j = 0, lenk = course.length; j < lenk; j++) {
        var gradeCategories = course[j].subjectVersion.gradeCategories;
        courseIds.push(course[j].courseId);
        for (var i = 0, len = gradeCategories.length; i < len; i++) {
          gradeCategoryIds.push(gradeCategories[i].gradeCategoryId);
        }
      }

      Grade.findAll({
        where: {
          gradeCategoryId: gradeCategoryIds,
          studentId: studentId,
          courseId: courseIds
        }
      })
        .success(function (grades) {
          buildCourseGradeStudent(course, grades);
        })
        .error(function (error) {
          callback(error);
        });

    }

    function buildCourseGradeStudent(course, grades) {

      // course grade
      var termGradeStudent = [];
      //      var courseGradeCategories = course.subjectVersion.gradeCategories;
      var grades = grades;

      var totalCredits = 0;
      var totalGrade = 0;
      var totalGradeNotFailed = 0;
      var totalCreditFail = 0;
      var totalCreditUnfinished = 0;
      var resultSubject = GradeStatus.PASS;

      for (var i = 0, len = course.length; i < len; i++) {

        var courseGradeCategories = course[i].subjectVersion.gradeCategories;
        var gradeStudent = [];
        var finalSubjectGrade = 0;
        var totalWeightGradeCategory = 0;
        var isFinish = false;
        resultSubject = GradeStatus.PASS;

        for (var j = 0, lenj = courseGradeCategories.length; j < lenj; j++) {

          var gradeCategory = courseGradeCategories[j];
          var minimumGrade = gradeCategory.minimumGrade;
          totalWeightGradeCategory = totalWeightGradeCategory + parseFloat(gradeCategory.weight);
          isFinish = false;

          for (var k = 0, lenk = grades.length; k < lenk; k++) {

            var grade = grades[k];

            if (gradeCategory.gradeCategoryId == grade.gradeCategoryId && course[i].courseId == grade.courseId) {

              isFinish = true;
              if (minimumGrade > 0 && minimumGrade > grade.value) {
                resultSubject = GradeStatus.FAIL;
              }
              k = lenk - 1;
              finalSubjectGrade = finalSubjectGrade + parseFloat(gradeCategory.weight) * parseFloat(grade.value);
            }
          }

        }

        if (totalWeightGradeCategory != 0) finalSubjectGrade = finalSubjectGrade / totalWeightGradeCategory;

        if (finalSubjectGrade < GradeConstant.PASS_GRADE) {
          resultSubject = GradeStatus.FAIL;
        }

        if (resultSubject == GradeStatus.FAIL && isFinish == true) {
          totalCreditFail = totalCreditFail + parseInt(course[i].subjectVersion.subject.numberOfCredits);
        }

        if (isFinish == false) {
          resultSubject = GradeStatus.UNFINISHED;
          totalCreditUnfinished = totalCreditUnfinished + parseInt(course[i].subjectVersion.subject.numberOfCredits);
        }

        totalCredits = totalCredits + parseInt(course[i].subjectVersion.subject.numberOfCredits);
        totalGrade = totalGrade + finalSubjectGrade * parseInt(course[i].subjectVersion.subject.numberOfCredits);
        finalSubjectGrade = finalSubjectGrade.toFixed(2);
        if (resultSubject == GradeStatus.PASS) {
          totalGradeNotFailed = totalGradeNotFailed + finalSubjectGrade * parseInt(course[i].subjectVersion.subject.numberOfCredits);
        }

        termGradeStudent.push({
          courseId: course[i].courseId,
          courseName: course[i].courseName,
          termName: course[i].term.termName,
          numberOfCredits: course[i].subjectVersion.subject.numberOfCredits,
          subjectName: course[i].subjectVersion.subject.subjectName,
          finalSubjectGrade: finalSubjectGrade,
          resultSubject: resultSubject
        });
      }

      var finalGrade = 0;

      var averageGrade = totalGrade / totalCredits;
      var accumulationGrade = 0;
      if ((totalCredits - totalCreditFail - totalCreditUnfinished) != 0) {
        accumulationGrade = totalGradeNotFailed / (totalCredits - totalCreditFail - totalCreditUnfinished);
      }
      averageGrade = averageGrade.toFixed(2);
      accumulationGrade = accumulationGrade.toFixed(2);

      if (isNaN(averageGrade)) averageGrade = null;

      termGradeStudent.push({
        statistic: StatisticType.AVERAGE_GRADE,
        numberOfCredits: totalCredits,
        finalSubjectGrade: averageGrade
      });

      termGradeStudent.push({
        statistic: StatisticType.TOTAL_CREDIT_FAIL,
        resultSubject: totalCreditFail
      });

      termGradeStudent.push({
        statistic: StatisticType.TOTAL_CREDIT_UNFINISHED,
        resultSubject: totalCreditUnfinished
      });

      termGradeStudent.push({
        statistic: StatisticType.TOTAL_CREDIT,
        resultSubject: totalCredits
      });

      termGradeStudent.push({
        statistic: StatisticType.ACCUMULATION_GRADE,
        resultSubject: accumulationGrade
      });

      var courseGradeStudent = {
        summaryGradeStudent: termGradeStudent,
        totalCredits: totalCredits,
        totalCreditFail: totalCreditFail,
        totalCreditUnfinished: totalCreditUnfinished,
        averageGrade: averageGrade,
        accumulationGrade: accumulationGrade
      };

      callback(null, courseGradeStudent, false);

    }

  };

  function checkIfGradeIsLocked(date, slot, skipCheckAfter, skipCheckBefore) {

    var isLocked = false;

    return isLocked;
  }

  model.importGrade = function (courseId, grades, userId, callback) {

    CourseStudent.findAll({
      where: {
        courseId: courseId
      },
      include: [{
        model: Student,
        as: 'student'
      }]
    })
      .success(function (courseStudent) {
        if (!courseStudent.length) {
          callback(null, 0);

          return;
        }

        var studentIdMap = {};

        for (var i = 0, len = courseStudent.length; i < len; i++) {
          var studentCode = courseStudent[i].student && courseStudent[i].student.studentCode;

          if (!studentCode) continue;

          studentIdMap[studentCode.toUpperCase()] = courseStudent[i].studentId;
        }

        doImportGrade(courseId, studentIdMap, grades, callback);
      })
      .error(function (error) {
        callback(error);
      });

    function doImportGrade(courseId, studentIdMap, grades, userId, callback) {

      var gradeData = [];

      Util.Collection.each(grades, function (studentGrades, studentCode) {
        studentCode = (studentCode || '').toUpperCase();
        var studentId = studentIdMap[studentCode];

        if (!studentId) return;

        for (var i = 0, len = studentGrades.length; i < len; i++) {
          var grade = {
            gradeCategoryId: studentGrades[i].gradeCategoryId,
            studentId: studentId,
            value: studentGrades[i].value
          }

          gradeData.push(grade);
        }
      });

      model.updateCourseGrade(courseId, gradeData, userId, function (error) {
        if (error) {
          callback(error);
        } else {
          callback(null, gradeData.length)
        }
      });

    }

  }

});
