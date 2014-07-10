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

  form.gridConfig = function () {

    // grid students
    var gridStudentsColumns = [{
        text: Lang.get('student.studentId'),
        dataField: 'studentId',

        width: '80px'
      }, {
        text: Lang.get('student.studentCode'),
        dataField: 'studentCode',

        width: '100px'
      },
      {
        text: Lang.get('student.firstName'),
        dataField: 'firstName'
      },
      {
        text: Lang.get('student.lastName'),
        dataField: 'lastName'
      },
      {
        text: Lang.get('student.className'),
        dataField: 'className',

        width: '120px'
      },
      {
        text: Lang.get('student.batchName'),
        dataField: 'batchName',

        width: '120px'
      },
      {
        text: Lang.get('student.majorName'),
        dataField: 'majorName'
      },
      {
        text: Lang.get('student.gender'),
        dataField: 'gender'
      },
      {
        text: Lang.get('student.dateOfBirth'),
        dataField: 'dateOfBirth'
      }
    ];

    // grid class students
    var gridClassStudentsColumns = [{
        text: Lang.get('student.studentId'),
        dataField: 'studentId',

        width: '80px'
      }, {
        text: Lang.get('student.studentCode'),
        dataField: 'studentCode',

        width: '100px'
      },
      {
        text: Lang.get('student.firstName'),
        dataField: 'firstName'
      },
      {
        text: Lang.get('student.lastName'),
        dataField: 'lastName'
      },
      {
        text: Lang.get('student.batchName'),
        dataField: 'batchName',

        width: '120px'
      },
      {
        text: Lang.get('student.majorName'),
        dataField: 'majorName'
      },
      {
        text: Lang.get('student.gender'),
        dataField: 'gender'
      },
      {
        text: Lang.get('student.dateOfBirth'),
        dataField: 'dateOfBirth'
      }
    ];

    var gridConfig = {
      gridStudents: {
        columns: gridStudentsColumns
      },
      gridClassStudents: {
        columns: gridClassStudentsColumns
      }
    };

    return gridConfig;

  };

  // the template that used by the form
  form.tmpl = 'form.manage-class.class-student';

  // the form type is FORM
  form.formType = form.FormType.FORM;

  form.initForm = function () {
    var splitter = this.element.find('#splitter');

    splitter.jqxSplitter({
      width: '100%',
      height: '100%'
    });

    var gridStudentsConfig = this.getGridConfig().gridStudents;
    var gridClassStudentsConfig = this.getGridConfig().gridClassStudents;

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
    this.element.find('#button-add-students').click(this.proxy(function () {
      var MsgBox = require('component.common.MsgBox');

      var studentIds = this.gridStudents.getSelectedIds();

      MsgBox.confirm(Lang.get('class.addStudents.confirm', {
        'totalItems': studentIds.length
      }), this.proxy(doAddStudents));
    }));

    // handle click for Remove Students button
    this.element.find('#button-remove-students').click(this.proxy(function () {
      var MsgBox = require('component.common.MsgBox');

      var studentIds = this.gridClassStudents.getSelectedIds();

      MsgBox.confirm(Lang.get('class.removeStudents.confirm', {
        'totalItems': studentIds.length
      }), this.proxy(doRemoveStudents));
    }));

    // handle click for Change direction button
    this.element.find('#button-change-orientation').click(this.proxy(toggleSplitterOrientation));

    toggleSplitterOrientation();

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

    function toggleSplitterOrientation() {

      var orientation = splitter.jqxSplitter('orientation');

      if (orientation == 'vertical') {
        splitter.jqxSplitter({
          orientation: 'horizontal',
          panels: [{
            size: '50%'
          }, {
            size: '50%'
          }]
        });
      } else {
        splitter.jqxSplitter({
          orientation: 'vertical',
          panels: [{
            size: '60%'
          }, {
            size: '40%'
          }]
        });
      }

      $(window).trigger('resize');

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
