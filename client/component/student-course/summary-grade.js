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

    this.data.attr('averageGrade', averageGrade);
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
