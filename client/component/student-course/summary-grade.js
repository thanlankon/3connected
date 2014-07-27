define.form('component.form.summary-grade.summary-grade', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'summary-grade'
    }
  };

  form.ServiceProxy = {
    proxy: require('proxy.Grade'),
    method: 'getSumaryGrade'
  };

  form.tmpl = 'form.summary-grade.summary-grade';

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
        case GradeStatus.UNFINISHED:
          var text = Lang.get('grade.status.unfinished');
          text = '<span class="grade-status grade-status-unfinished">' + text + '</span>';

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
    var averageGrade = originalData.data && originalData.data.averageGrade;
    var totalCredits = originalData.data && originalData.data.totalCredits;
    var totalCreditFailed = originalData.data && originalData.data.totalCreditFailed;

    this.data.attr('displayAverageGrade', averageGrade != null);

    this.data.attr('averageGrade', averageGrade);
    this.data.attr('totalCredits', totalCredits);
    this.data.attr('totalCreditFailed', totalCreditFailed);
  };

  form.initForm = function () {

    // bind event handlers to elements
    this.element.find('#button-view-summary-grade').click(this.proxy(this.viewSummaryGrade));
  };

  // init form data
  form.initData = function () {

    var componentSettings = {
      termId: {
        ServiceProxy: require('proxy.Term'),
        combobox: {
          valueMember: 'termId',
          displayMember: 'termName'
        }
      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);
  };

  form.viewSummaryGrade = function () {

    var termId = this.data.attr('termId');

    this.grid.setFilterConditions('termId', termId);

  };

});
