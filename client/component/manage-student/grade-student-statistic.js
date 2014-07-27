/*
 * System          : 3connected
 * Component       : Statistic grade component
 * Creator         : UayLU
 * Created date    : 2014/07/27
 */
define.form('component.form.manage-student.grade-student-statistic', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-student',
      action: 'grade-statistic'
    }
  };

  form.ServiceProxy = {
    proxy: require('proxy.Grade'),
    method: 'statisticGradeStudent'
  };

  form.tmpl = 'form.manage-student.grade-student-statistic';

  form.exportConfig = require('export.GradeStudentStatistic');

  form.formType = form.FormType.Form.LIST;

  // grid config
  form.gridConfig = function () {

    var GradeStatus = require('enum.GradeStatus');
    var StatisticType = require('enum.StatisticType');

    var gridColumns = [{
      text: Lang.get('course.courseName'),
      dataField: 'courseName',

      cellsRenderer: function (row, columnField, value) {
        var text;
        if (row.statistic == undefined) {
          text = row.courseName;
        } else {
          switch (row.statistic) {
          case StatisticType.AVERAGE_GRADE:
            text = Lang.get('grade.averageGrade');
            text = '<span class="statistic">' + text + '</span>';

            break;
          case StatisticType.ACCUMULATION_GRADE:
            text = Lang.get('grade.accumulationGrade');
            text = '<span class="statistic">' + text + '</span>';

            break;
          case StatisticType.TOTAL_CREDIT_PASS:
            text = Lang.get('grade.totalCreditPass');
            text = '<span class="statistic">' + text + '</span>';

            break;
          case StatisticType.TOTAL_CREDIT_FAIL:
            text = Lang.get('grade.totalCreditFail');
            text = '<span class="statistic">' + text + '</span>';

            break;
          case StatisticType.TOTAL_CREDIT_UNFINISHED:
            text = Lang.get('grade.totalCreditUnfinished');
            text = '<span class="statistic">' + text + '</span>';

            break;
          case StatisticType.TOTAL_CREDIT:
            text = Lang.get('grade.totalCredits');
            text = '<span class="statistic">' + text + '</span>';

            break;
          }
        }

        return text;
      }
    }, {
      text: Lang.get('course.subjectName'),
      dataField: 'subjectName',
    }, {
      text: Lang.get('term.termName'),
      dataField: 'termName',
    }, {
      text: Lang.get('course.numberOfCredits'),
      dataField: 'numberOfCredits',

      cellsRenderer: function (row, columnField, value) {
        var text = value;

        if (row.statistic) {
          text = '<span class="statistic">' + text + '</span>';
        }

        return text;
      }
    }, {
      text: Lang.get('course.finalSubjectGrade'),
      dataField: 'finalSubjectGrade',

      cellsRenderer: function (row, columnField, value) {
        var text = value;

        if (row.statistic) {
          text = '<span class="statistic">' + text + '</span>';
        }

        return text;
      }
    }, {
      text: Lang.get('course.resultSubject'),
      dataField: 'resultSubject',
      width: 100,

      cellsRenderer: function (row, columnField, value) {
        var text;

        if (row.statistic) {
          text = '<span class="statistic">' + value + '</span>';
        } else {
          switch (value) {
          case GradeStatus.PASS:
            text = Lang.get('grade.status.pass');
            text = '<span class="grade-status grade-status-pass">' + text + '</span>';

            break;
          case GradeStatus.FAIL:
            text = Lang.get('grade.status.fail');
            text = '<span class="grade-status grade-status-fail">' + text + '</span>';

            break;
          case GradeStatus.UNFINISHED:
            text = Lang.get('grade.status.unfinished');
            text = '<span class="grade-status grade-status-unfinished">' + text + '</span>';

            break;
          }
        }

        return text;
      }
    }];

    var gridConfig = {
      columns: gridColumns,
      singleSelection: true,
      filterable: false,
      sortable: false,
      pageable: false,

      events: {
        processData: this.proxy(this.processData)
      }
    };

    return gridConfig;

  };

  form.processData = function (data, originalData) {
    var accumulationGrade = originalData.data && originalData.data.accumulationGrade;
    var totalCredits = originalData.data && originalData.data.totalCredits;
    var totalCreditFail = originalData.data && originalData.data.totalCreditFail;
    var totalCreditUnfinished = originalData.data && originalData.data.totalCreditUnfinished;

    this.data.attr('accumulationGrade', accumulationGrade);
    this.data.attr('totalCredits', totalCredits);
    this.data.attr('totalCreditFail', totalCreditFail);
    this.data.attr('totalCreditUnfinished', totalCreditUnfinished);
  };


  form.refreshData = function (data) {

    var studentId = data.id;

    this.grid.setFilterConditions('studentId', studentId);

    var StudentProxy = require('proxy.Student');

    StudentProxy.findOne({
      studentId: studentId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var student = serviceResponse.getData();

      this.data.attr({
        student: student
      });
    }
  }

});
