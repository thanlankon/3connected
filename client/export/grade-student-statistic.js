define('export.GradeStudentStatistic', function (module, require) {

  module.exports = {

    fileName: 'GradeStudentStatistic',
    sheetName: 'GradeStudentStatistic',

    columns: {

      courseId: {
        width: 10
      },
      courseName: {
        width: 30
      },
      subjectName: {
        width: 30
      },
      numberOfCredits: {
        width: 15
      },
      finalSubjectGrade: {
        width: 15
      },
      resultSubject: {
        width: 15
      }


    }

  };

});
