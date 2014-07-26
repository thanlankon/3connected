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
    method: 'statisticCourseAttendance',
    entityMap: 'StatisticCourseAttendanceEntityMap'
  };

  form.tmpl = 'form.manage-course.list-course';

  form.formType = form.FormType.Form.LIST;

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
      columns: gridColumns
    };

    return gridConfig;

  };


  form.refreshData = function (data) {
    var Role = require('enum.Role');

    if (Role.isTeacher(form.authentication.accountRole)) {
      this.grid.setFilterConditions('lectureId', form.authentication.userInformationId);
    }

  }

});
