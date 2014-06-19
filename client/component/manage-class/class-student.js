define.form('component.form.manage-class.ClassStudent', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-class
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-class',
      action: 'class-student'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-class.class-student';

  // the form type is FORM
  form.formType = form.FormType.FORM;

  form.initForm = function () {
    var splitter = this.element.find('#splitter');

    splitter.jqxSplitter({
      width: '100%',
      height: '100%',
      panels: [{
        size: '60%'
      }]
    });


    var gridStudentsColumns = [{
        text: Lang.get('student.studentId'),
        dataField: 'studentId',

        width: '150px',
      }, {
        text: Lang.get('student.studentCode'),
        dataField: 'studentCode',

        width: '150px',
      },
      {
        text: Lang.get('student.firstName'),
        dataField: 'firstName',

        width: '150px',
      },
      {
        text: Lang.get('student.lastName'),
        dataField: 'lastName',

        width: '200px',
      },
      {
        text: Lang.get('student.className'),
        dataField: 'className',

        width: '100px',
      },
      {
        text: Lang.get('student.batchName'),
        dataField: 'batchName',

        width: '120px',
      },
      {
        text: Lang.get('student.majorName'),
        dataField: 'majorName',

        width: '120px',
      },
      {
        text: Lang.get('student.gender'),
        dataField: 'gender',
      },
      {
        text: Lang.get('student.dateOfBirth'),
        dataField: 'dateOfBirth',

        width: '100px'
      }
    ];

    var gridClassStudentsColumns = [{
        text: Lang.get('student.studentCode'),
        dataField: 'studentCode',

        width: '150px',
      },
      {
        text: Lang.get('student.firstName'),
        dataField: 'firstName',

        width: '150px',
      },
      {
        text: Lang.get('student.lastName'),
        dataField: 'lastName',

        width: '200px',
      },
      {
        text: Lang.get('student.gender'),
        dataField: 'gender',
      },
      {
        text: Lang.get('student.dateOfBirth'),
        dataField: 'dateOfBirth',

        width: '100px'
      }
    ];

    var gridStudentsConfig = {
      columns: gridStudentsColumns
    };

    var gridClassStudentsConfig = {
      columns: gridClassStudentsColumns
    };

    var StudentProxy = require('proxy.Student');

    var GridComponent = require('component.common.Grid');

    this.gridStudents = new GridComponent(this.element.find('#grid-students'), {
      ServiceProxy: StudentProxy,
      grid: gridStudentsConfig
    });

    this.gridClassStudents = new GridComponent(this.element.find('#grid-class-students'), {
      ServiceProxy: StudentProxy,
      grid: gridClassStudentsConfig
    });

    // handle click for Add Students button
    this.element.find('#button-add-students').click(this.proxy(doAddStudents));

    // handle click for Remove Students button
    this.element.find('#button-remove-students').click(this.proxy(doRemoveStudents));

    function doAddStudents() {
      var studentIds = this.gridStudents.getSelectedIds();

      if (!studentIds.length) return;

      var classId = this.data.attr('classId');

      var data = {
        classId: classId,
        studentIds: studentIds
      };

      var ClassProxy = require('proxy.Class');

      ClassProxy.addStudents(data, this.proxy(refreshGridData));
    }

    function doRemoveStudents() {
      var studentIds = this.gridClassStudents.getSelectedIds();

      if (!studentIds.length) return;

      var classId = this.data.attr('classId');

      var data = {
        classId: classId,
        studentIds: studentIds
      };

      var ClassProxy = require('proxy.Class');

      ClassProxy.removeStudents(data, this.proxy(refreshGridData));
    }

    function refreshGridData() {
      this.gridStudents.refreshData();
      this.gridClassStudents.refreshData();
    }

  };

  form.refreshData = function (data) {
    var classId = data.id;

    var ClassProxy = require('proxy.Class');

    ClassProxy.findOne({
      classId: classId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var classInfo = serviceResponse.getData();

      this.data.attr(classInfo);

      this.gridStudents.setExcludeConditions('classId', classInfo.classId);
      this.gridClassStudents.setFilterConditions('classId', classInfo.classId);
    }
  }

});
