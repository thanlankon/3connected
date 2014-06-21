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
    var gridConfig = this.getGridConfig();

    var ScheduleGridComponent = require('component.common.ScheduleGrid');

    this.gridSchedule = new ScheduleGridComponent('#grid-course-schedule');

    // default is view mode
    //    this.switchToViewMode();
    this.switchToEditMode();

    // bind event handlers to elements
    this.element.find('#button-view-schedule').click(this.proxy(this.viewSchedule));
    this.element.find('#button-update-schedule').click(this.proxy(this.updateSchedule));

    this.element.find('#button-reject-changes').click(this.proxy(this.switchToViewMode));
    this.element.find('#button-edit-schedule').click(this.proxy(this.switchToEditMode));
  };

  form.refreshData = function (data) {
    var courseId = data.id;

    var CourseProxy = require('proxy.Course');

    CourseProxy.findOne({
      courseId: courseId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var Moment = require('lib.Moment');

      this.data.attr({
        // course info
        course: serviceResponse.getData(),
        // schedule
        schedule: {
          startDate: null,
          endDate: null
        }
      });

      this.data.attr({
        schedule: {
          startDate: Moment().toDate(),
          endDate: Moment().add('days', 10).toDate()
        }
      });
    }
  };

  form.viewSchedule = function () {
    var ConvertUtil = require('core.util.ConvertUtil');

    var startDate = this.data.attr('schedule.startDate');
    var endDate = this.data.attr('schedule.endDate');

    // startDate and endDate are string, convert them to Date
    if (startDate) {
      startDate = ConvertUtil.DateTime.parseDate(startDate);
    }
    if (endDate) {
      endDate = ConvertUtil.DateTime.parseDate(endDate);
    }

    this.gridSchedule.refreshData(startDate, endDate);
  };

  form.updateSchedule = function () {
    var scheduleData = this.gridSchedule.getScheduleData();

    console.log(scheduleData);
  };

  form.switchToViewMode = function () {
    // hide all edit toolbar component
    this.element.find('[data-component-group=edit]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=view]').show();

    // disable grid editable
    this.gridSchedule.setEditable(false);
  };

  form.switchToEditMode = function () {
    // hide all edit component
    this.element.find('[data-component-group=view]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=edit]').show();

    // disable grid editable
    this.gridSchedule.setEditable(true);
  };

});
