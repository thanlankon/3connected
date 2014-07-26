define.form('component.form.manage-course.CourseAttendanceStatistic', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-course',
      action: 'attendance-statistic'
    }
  };

  form.ServiceProxy = {
    proxy: require('proxy.Attendance'),
    method: 'statisticCourseAttendance'
  };

  form.tmpl = 'form.manage-course.course-attendance-statistic';

  form.formType = form.FormType.Form.LIST;

  // the config used for exporting grid data
  form.exportConfig = require('export.AttendanceStatistic');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
        text: Lang.get('student.studentId'),
        dataField: 'studentId',

        cellsAlign: 'right',
        filterType: 'textbox',

        width: 100,
        hidden: false
      }, {
        text: Lang.get('student.firstName'),
        dataField: 'firstName',
      }, {
        text: Lang.get('student.lastName'),
        dataField: 'lastName',
      }, {
        text: Lang.get('student.totalAbsent'),
        dataField: 'totalAbsent',
      }, {
        text: Lang.get('student.totalPresent'),
        dataField: 'totalPresent',
      }, {
        text: Lang.get('student.totalSlots'),
        dataField: 'totalSlots',
      }, {
        text: Lang.get('student.percentAbsent'),
        dataField: 'percentAbsent'
      }
      ];

    var gridConfig = {
      columns: gridColumns,
      singleSelection: true,
      filterable: false,
      sortable: false,
      pageable: false,
    };

    return gridConfig;

  };


  form.refreshData = function (data) {
    var courseId = data.id;

    this.grid.setFilterConditions('courseId', courseId);

    var CourseProxy = require('proxy.Course');

    CourseProxy.findOne({
      courseId: courseId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var course = serviceResponse.getData();

      this.data.attr({
        course: course
      });
    }
  }

});
