define.form('component.form.view-attendance.ListAttendance', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-course/schedule/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'student-course',
      action: 'attendance'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.student-course.course-attendance';

  // the form type is FORM
  form.formType = form.FormType.FORM;

  form.initForm = function () {

    var ScheduleGridComponent = require('component.common.ViewAttendanceGrid');

    this.gridSchedule = new ScheduleGridComponent(this.element.find('#grid-course-schedule'));

    // bind event handlers to elements
    this.element.find('#button-view-schedule').click(this.proxy(this.viewSchedule));
    this.element.find('#button-refresh-schedule').click(this.proxy(this.refreshSchedule));

  };

  form.refreshData = function (data) {

    this.courseId = data.id;

    var CourseProxy = require('proxy.Course');

    CourseProxy.findOneCourseStudent({
      courseId: this.courseId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var course = serviceResponse.getData();

      this.data.attr({
        course: course
      });
    }

    this.switchToViewMode();

  };

  form.viewSchedule = function () {
    var ConvertUtil = require('core.util.ConvertUtil');

    var startDate = this.data.attr('schedule.startDate');
    var endDate = this.data.attr('schedule.endDate');

    this.gridSchedule.refreshData(startDate, endDate);
  };

  form.refreshSchedule = function () {
    var CourseProxy = require('proxy.Course');

    CourseProxy.findAttendanceStudent({
      courseId: this.courseId
    }, this.proxy(findAttendanceStudent));


    function findAttendanceStudent(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var ConvertUtil = require('core.util.ConvertUtil');

      var courseAttendanceStudent = serviceResponse.getData();

      this.data.attr({
        // courseAttendanceStudent info
        courseAttendanceStudent: courseAttendanceStudent,
        // course infor
        course: null,
        // schedule
        schedule: {
          startDate: null,
          endDate: null
        }
      });

      var schedulesAttendanceStudent = [];
      if (courseAttendanceStudent.length) {
        schedulesAttendanceStudent = courseAttendanceStudent[0].schedules;
      }

      CourseProxy.findOneCourseStudent({
        courseId: this.courseId
      }, this.proxy(findOneCourseStudent));



      function findOneCourseStudent(serviceResponse) {
        if (serviceResponse.hasError()) return;

        var course = serviceResponse.getData();

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

          var AttendanceProxy = require('proxy.Attendance');

          AttendanceProxy.getCourseAttendanceStudent({
            courseId: this.courseId,
            scheduleId: schedules[0].scheduleId
          }, this.proxy(findOneAttendanceDone));

          function findOneAttendanceDone(serviceResponse) {
            if (serviceResponse.hasError()) return;

            var courseAttendance = serviceResponse.getData();

            var percentAbsents = courseAttendance.statistics.studentAttendances[courseAttendance.students[0].studentId].totalAbsents / courseAttendance.statistics.totalSlots * 100;
            percentAbsents = percentAbsents.toFixed(2);
            this.data.attr({
              courseAttendance: {
                percentAbsents: percentAbsents,
                totalAbsents: courseAttendance.statistics.studentAttendances[courseAttendance.students[0].studentId].totalAbsents,
                totalPresents: courseAttendance.statistics.studentAttendances[courseAttendance.students[0].studentId].totalPresents,

              }
            });
          }

          this.data.attr({
            course: course,
            schedule: {
              startDate: startDate,
              endDate: endDate,
              length: schedules.length
            }
          });
          this.gridSchedule.refreshData(startDate, endDate, schedules, schedulesAttendanceStudent);

        } else {
          this.gridSchedule.refreshData();
        }
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

});
