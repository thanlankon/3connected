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

    new ScheduleGridComponent('#grid-course-schedule');
  };

  form.refreshData = function (data) {
    var courseId = data.id;

    var CourseProxy = require('proxy.Course');

    CourseProxy.findOne({
      courseId: courseId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      console.log(serviceResponse);
    }
  }

});
