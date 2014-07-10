/*
 * System          : 3connected
 * Component       : Grade category versions component
 * Creator         : UayLU + ThanhVM
 * Created date    : 2014/18/06
 */

define.form('component.form.manage-course.CourseStudent', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-course/course-student/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-course',
      action: 'course-student'
    }
  };

  form.exportConfig = require('export.Student');

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
        dataField: 'majorName',

        width: '200px'
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
    var gridCourseStudentsColumns = [{
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
        dataField: 'majorName',

        width: '200px'
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
      gridCourseStudents: {
        columns: gridCourseStudentsColumns
      }
    };

    return gridConfig;

  };

  // the template that used by the form
  form.tmpl = 'form.manage-course.course-student';

  // the form type is FORM
  form.formType = form.FormType.FORM;

  form.initForm = function () {
    var splitter = this.element.find('#splitter');

    splitter.jqxSplitter({
      width: '100%',
      height: '100%'
    });

    var gridStudentsConfig = this.getGridConfig().gridStudents;
    var gridCourseStudentsConfig = this.getGridConfig().gridCourseStudents;

    var StudentProxy = require('proxy.Student');
    var CourseStudentProxy = require('proxy.CourseStudent');

    var GridComponent = require('component.common.Grid');

    this.gridStudents = new GridComponent(this.element.find('#grid-students'), {
      ServiceProxy: StudentProxy,
      grid: gridStudentsConfig
    });

    this.gridCourseStudents = new GridComponent(this.element.find('#grid-course-students'), {
      ServiceProxy: CourseStudentProxy,
      grid: gridCourseStudentsConfig
    });

    // handle click for Add Students button
    this.element.find('#button-add-students').click(this.proxy(function () {
      var MsgBox = require('component.common.MsgBox');

      var studentIds = this.gridStudents.getSelectedIds();

      MsgBox.confirm(Lang.get('course.addStudents.confirm', {
        'totalItems': studentIds.length
      }), this.proxy(doAddStudents));
    }));

    // handle click for Remove Students button
    this.element.find('#button-remove-students').click(this.proxy(function () {
      var MsgBox = require('component.common.MsgBox');

      var studentIds = this.gridCourseStudents.getSelectedIds();

      MsgBox.confirm(Lang.get('course.removeStudents.confirm', {
        'totalItems': studentIds.length
      }), this.proxy(doRemoveStudents));
    }));

    // handle click for Change direction button
    this.element.find('#button-change-orientation').click(this.proxy(toggleSplitterOrientation));
    // handle window resize
    jQuery(window).resize(this.proxy(this.refreshGridSize));

    toggleSplitterOrientation.apply(this);

    function doAddStudents() {
      var studentIds = this.gridStudents.getSelectedIds();

      if (!studentIds.length) return;

      var courseId = this.data.attr('courseId');

      var CourseStudentProxy = require('proxy.CourseStudent');

      var data = {
        courseId: courseId,
        studentIds: studentIds
      };

      CourseStudentProxy.addStudents(data, this.proxy(refreshGridData));

    }

    function doRemoveStudents() {
      var courseStudentIds = this.gridCourseStudents.getSelectedIds();

      if (!courseStudentIds.length) return;

      var courseId = this.data.attr('courseId');
      var CourseStudentProxy = require('proxy.CourseStudent');

      var data = {
        courseStudentIds: courseStudentIds
      };

      CourseStudentProxy.removeStudents(data, this.proxy(refreshGridData));
    }

    function refreshGridData() {
      this.gridStudents.refreshData();
      this.gridCourseStudents.refreshData();
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

      // $(window).trigger('resize');

      this.refreshGridSize();
    }

  };

  form.refreshGridSize = function () {
    this.gridStudents.refreshSize();
    this.gridCourseStudents.refreshSize();
  };

  form.refreshData = function (data) {
    var courseId = data.id;

    var CourseProxy = require('proxy.Course');

    CourseProxy.findOne({
      courseId: courseId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var courseInfo = serviceResponse.getData();

      this.data.attr(courseInfo);

      //this.gridStudents.setExcludeConditions('classId', classInfo.classId);
      this.gridCourseStudents.setFilterConditions('courseId', courseInfo.courseId);
    }
  }

});
