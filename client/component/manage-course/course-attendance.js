define.form('component.form.manage-course.CourseAttendance', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-course/attendance/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-course',
      action: 'attendance'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-course.course-attendance';

  // the form type is FORM
  form.formType = form.FormType.FORM;

  form.initData = function () {

    var componentSettings = {
      scheduleId: {
        localDataAttribute: 'schedules',
        combobox: {
          valueMember: 'scheduleId',
          displayMember: 'dateSlot'
        }
      }
    };

    this.data.attr({
      componentSettings: componentSettings
    });

  };

  form.initForm = function () {
    var AttendanceGridComponent = require('component.common.AttendanceGrid');

    this.gridAttendance = new AttendanceGridComponent(this.element.find('#grid-course-attendance'));

    // bind event handlers to elements
    this.element.find('#button-view-attendance').click(this.proxy(this.viewAttendance));
    this.element.find('#button-update-attendance').click(this.proxy(this.updateAttendance));

    this.element.find('#button-reject-changes').click(this.proxy(this.switchToViewMode));
    this.element.find('#button-edit-attendance').click(this.proxy(this.switchToEditMode));
  };

  form.refreshData = function (data) {
    var courseId = data.id;

    this.data.attr('scheduleId', null);
    this.switchToDisableMode();

    var CourseProxy = require('proxy.Course');

    CourseProxy.findOne({
      courseId: courseId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var ConvertUtil = require('core.util.ConvertUtil');

      var course = serviceResponse.getData();

      var schedules = [];

      for (var i = 0, len = course.schedules.length; i < course.schedules.length; i++) {
        var schedule = course.schedules[i];

        schedules.push({
          scheduleId: schedule.scheduleId,
          dateSlot: schedule.date + ' - slot ' + schedule.slot
        });
      }

      this.data.attr({
        course: course,
        schedules: null
      });

      this.data.attr({
        schedules: schedules
      });
    }

  };

  form.viewAttendance = function () {
    this.switchToViewMode();
  }

  form.refreshAttendance = function () {

    this.scheduleId = this.data.attr('scheduleId');

    if (!this.scheduleId) return;

    var AttendanceProxy = require('proxy.Attendance');

    var data = {
      scheduleId: this.scheduleId,
    };

    AttendanceProxy.getCourseAttendance(data, this.proxy(getCourseAttendanceDone));

    function getCourseAttendanceDone(serviceResponse) {

      var attendanceData = serviceResponse.getData();

      console.log(this.isGridMode);

      if (attendanceData.isLocked) {
        if (this.isGridMode !== 'DISABLED') {
          this.switchToDisableMode();
        }
      } else if (attendanceData.attendances && attendanceData.attendances.length) {
        if (this.isGridMode !== 'READONLY' && this.isGridMode !== 'EDITABLE') {
          this.switchToViewMode();
        }
      } else {
        if (this.isGridMode !== 'EDITABLE') {
          this.switchToEditMode();
        }
      }

      this.gridAttendance.refreshData(attendanceData);

    }

  };

  form.updateAttendance = function () {

    var scheduleId = this.scheduleId;
    var attendanceData = this.gridAttendance.getAttendanceData();

    var AttendanceProxy = require('proxy.Attendance');

    var data = {
      scheduleId: scheduleId,
      attendanceData: attendanceData
    };

    AttendanceProxy.updateCourseAttendance(data, this.proxy(updateCourseAttendanceDone));

    function updateCourseAttendanceDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      this.refreshAttendance();
    }
  };

  form.switchToDisableMode = function () {
    this.isGridMode = 'DISABLED';

    // hide all edit toolbar component
    this.element.find('[data-component-group=edit]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=view]').hide();

    // disable grid editable
    this.gridAttendance.setEditable(false);
    this.gridAttendance.refreshData();
  }

  form.switchToViewMode = function () {
    this.isGridMode = 'READONLY';

    // hide all edit toolbar component
    this.element.find('[data-component-group=edit]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=view]').show();

    // disable grid editable
    this.gridAttendance.setEditable(false);

    this.refreshAttendance();
  };

  form.switchToEditMode = function () {
    this.isGridMode = 'EDITABLE';

    // hide all edit component
    this.element.find('[data-component-group=view]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=edit]').show();

    // enable grid editable
    this.gridAttendance.setEditable(true);

    this.refreshAttendance();
  };

});
