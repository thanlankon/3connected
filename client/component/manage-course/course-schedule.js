define.form('component.form.manage-course.CourseSchedule', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-course/schedule/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-course',
      action: 'schedule'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-course.course-schedule';

  // the form type is FORM
  form.formType = form.FormType.FORM;

  form.initForm = function () {

    var ScheduleGridComponent = require('component.common.ScheduleGrid');

    this.gridSchedule = new ScheduleGridComponent(this.element.find('#grid-course-schedule'));

    // bind event handlers to elements
    this.element.find('#button-view-schedule').click(this.proxy(this.viewSchedule));
    this.element.find('#button-refresh-schedule').click(this.proxy(this.refreshSchedule));
    this.element.find('#button-update-schedule').click(this.proxy(this.updateSchedule));

    this.element.find('#button-reject-changes').click(this.proxy(this.switchToViewMode));
    this.element.find('#button-edit-schedule').click(this.proxy(this.switchToEditMode));

  };

  form.refreshData = function (data) {

    this.courseId = data.id;

    this.switchToViewMode();

  };

  form.viewSchedule = function () {
    var ConvertUtil = require('core.util.ConvertUtil');

    var startDate = this.data.attr('schedule.startDate');
    var endDate = this.data.attr('schedule.endDate');

    this.gridSchedule.refreshData(startDate, endDate);
  };

  form.updateSchedule = function () {
    var scheduleData = this.gridSchedule.getScheduleData();

    // check if data has been changed
    if (!scheduleData.addedItems.length && !scheduleData.removedItems.length) return;

    // set courseId of the schedule
    scheduleData.courseId = this.data.attr('course.courseId');

    var CourseProxy = require('proxy.Course');

    CourseProxy.updateSchedule(scheduleData, this.proxy(updateScheduleDone));

    function updateScheduleDone(serviceResponse) {
      if (!serviceResponse.hasError()) {
        this.refreshSchedule();
      }
    }
  };

  form.refreshSchedule = function () {
    var CourseProxy = require('proxy.Course');

    CourseProxy.findOne({
      courseId: this.courseId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var ConvertUtil = require('core.util.ConvertUtil');

      var course = serviceResponse.getData();

      this.data.attr({
        // course info
        course: course,
        // schedule
        schedule: {
          startDate: null,
          endDate: null
        }
      });

      var schedules = course.schedules;

      if (schedules && schedules.length) {
        // find start date and end date of the schedule

        var startDate = Util.Collection.min(schedules, function (schedule) {
          var date = ConvertUtil.DateTime.parseDate(schedule.date);
          return date;
        });
        startDate = startDate.date;

        var endDate = Util.Collection.max(schedules, function (schedule) {
          var date = ConvertUtil.DateTime.parseDate(schedule.date);
          return date;
        });
        endDate = endDate.date;

        this.data.attr({
          schedule: {
            startDate: startDate,
            endDate: endDate
          }
        });

        this.gridSchedule.refreshData(startDate, endDate, schedules);

      } else {
        this.gridSchedule.refreshData();
      }
    }

  };

  form.switchToViewMode = function () {
    // hide all edit toolbar component
    this.element.find('[data-component-group=edit]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=view]').show();

    // disable grid editable
    this.gridSchedule.setEditable(false);

    this.refreshSchedule();
  };

  form.switchToEditMode = function () {
    // hide all edit component
    this.element.find('[data-component-group=view]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=edit]').show();

    // enable grid editable
    this.gridSchedule.setEditable(true);
  };

});
