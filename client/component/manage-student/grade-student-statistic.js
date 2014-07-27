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

    var gridColumns = [{
      text: Lang.get('course.courseId'),
      dataField: 'courseId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 150,
    }, {
      text: Lang.get('course.courseName'),
      dataField: 'courseName',
    }, {
      text: Lang.get('course.subjectName'),
      dataField: 'subjectName',
    }, {
      text: Lang.get('course.numberOfCredits'),
      dataField: 'numberOfCredits',
    }, {
      text: Lang.get('course.finalSubjectGrade'),
      dataField: 'finalSubjectGrade',
    }, {
      text: Lang.get('course.resultSubject'),
      dataField: 'resultSubject',
      width: 100,

      cellsRenderer: function (row, columnField, value) {
        switch (value) {
        case GradeStatus.PASS:
          var text = Lang.get('grade.status.pass');
          text = '<span class="grade-status grade-status-pass">' + text + '</span>';

          break;
        case GradeStatus.FAIL:
          var text = Lang.get('grade.status.fail');
          text = '<span class="grade-status grade-status-fail">' + text + '</span>';

          break;
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
    var totalCreditFailed = originalData.data && originalData.data.totalCreditFailed;
    var totalCreditCurrentLearn = originalData.data && originalData.data.totalCreditCurrentLearn;

    this.data.attr('accumulationGrade', accumulationGrade);
    this.data.attr('totalCredits', totalCredits);
    this.data.attr('totalCreditFailed', totalCreditFailed);
    this.data.attr('totalCreditCurrentLearn', totalCreditCurrentLearn);
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
