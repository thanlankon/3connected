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

    //    this.element.find('#button-update-schedule').click(this.proxy(this.updateSchedule));
    //
    //    this.element.find('#button-reject-changes').click(this.proxy(this.switchToViewMode));
    //    this.element.find('#button-edit-schedule').click(this.proxy(this.switchToEditMode));
  };

  form.refreshData = function (data) {
    this.courseId = data.id;

    this.refreshAttendance();
  };

  form.refreshAttendance = function () {
    var CourseProxy = require('proxy.Course');

    CourseProxy.findOne({
      courseId: this.courseId
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
    console.log(this.courseId, this.data.attr('scheduleId'));
  };

});
