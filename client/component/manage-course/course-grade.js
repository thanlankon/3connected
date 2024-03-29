/*
 * System          : 3connected
 * Component       : Input grade component
 * Creator         : UayLU
 * Created date    : 2014/06/14
 */
define.form('component.form.manage-course.CourseGrade', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-course/grade/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-course',
      action: 'grade'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-course.course-grade';

  // the form type is FORM
  form.formType = form.FormType.FORM;

  form.exportConfig = {
    gridGrade: require('export.CourseGrade')
  }

  form.initForm = function () {
    var GradeGridComponent = require('component.common.GradeGrid');

    this.gridGrade = new GradeGridComponent(this.element.find('#grid-course-grade'));

    // bind event handlers to elements
    this.element.find('#button-update-grade').click(this.proxy(this.updateGrade));

    this.element.find('#button-reject-changes').click(this.proxy(this.rejectChanges));
    this.element.find('#button-edit-grade').click(this.proxy(this.editGrade));

    this.element.find('#button-notify-grade').click(this.proxy(this.notifyGrade));
  };

  form.notifyGrade = function () {
    var NotificationProxy = require('proxy.Notification');
    var MsgBox = require('component.common.MsgBox');

    MsgBox.confirm(Lang.get('notification.confirm.grade'), this.proxy(doNotifyGrade));

    function doNotifyGrade() {
      NotificationProxy.notifyGrade({
        courseId: this.courseId
      }, function (serviceResponse) {
        if (serviceResponse.hasError()) return;
      });
    }
  };

  form.refreshData = function (data) {
    this.courseId = data.id;

    this.switchToLockedMode();

    var CourseProxy = require('proxy.Course');

    CourseProxy.findOne({
      courseId: this.courseId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var course = serviceResponse.getData();

      this.data.attr({
        course: course
      });

      this.refreshGrade();
    }

  };

  form.refreshGrade = function () {

    if (!this.courseId) return;

    var GradeProxy = require('proxy.Grade');

    var data = {
      courseId: this.courseId
    };

    GradeProxy.getCourseGrade(data, this.proxy(getCourseGradeDone));

    function getCourseGradeDone(serviceResponse) {

      if (serviceResponse.hasError()) {
        this.gridGrade.refreshData();
        return;
      }

      var gradeData = serviceResponse.getData();

      if (!gradeData.gradeCategories || !gradeData.gradeCategories.length) {
        this.data.attr('noGradeCategories', true);
        gradeData.isLocked = true;
      } else {
        this.data.attr('noGradeCategories', false);
      }

      if (gradeData.isLocked) {
        this.switchToLockedMode();
      } else if (gradeData.grades && gradeData.grades.length) {
        this.switchToViewMode();
      } else {
        this.switchToEditMode();
      }

      this.gridGrade.refreshData(gradeData);

    }

  };

  form.updateGrade = function () {

    var courseId = this.courseId;
    var gradeData = this.gridGrade.getGradeData();

    if (!gradeData.length) return;

    var GradeProxy = require('proxy.Grade');

    var data = {
      courseId: courseId,
      gradeData: gradeData
    };

    GradeProxy.updateCourseGrade(data, this.proxy(updateCourseGradeDone));

    function updateCourseGradeDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      this.refreshGrade();
    }
  };

  form.editGrade = function () {
    this.switchToEditMode();
  };

  form.rejectChanges = function () {
    this.switchToViewMode();
    this.refreshGrade();
  };

  form.switchToLockedMode = function () {
    // hide all edit toolbar component
    this.element.find('[data-component-group=edit]').hide();

    // hide all view toolbar component
    this.element.find('[data-component-group=view]').hide();

    // disable grid editable
    this.gridGrade.setEditable(false);
  };

  form.switchToViewMode = function () {
    // hide all edit toolbar component
    this.element.find('[data-component-group=edit]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=view]').show();

    // disable grid editable
    this.gridGrade.setEditable(false);
  };

  form.switchToEditMode = function () {
    // hide all edit component
    this.element.find('[data-component-group=view]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=edit]').show();

    // enable grid editable
    this.gridGrade.setEditable(true);
  };

});
