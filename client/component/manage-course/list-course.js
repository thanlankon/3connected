define.form('component.form.manage-course.ListCourse', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-course'
    }
  };

  form.ServiceProxy = require('proxy.Course');

  form.tmpl = 'form.manage-course.list-course';

  form.formType = form.FormType.Form.LIST;

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
        text: Lang.get('course.courseId'),
        dataField: 'courseId',

        cellsAlign: 'right',
        filterType: 'textbox',

        width: 100,
        hidden: false
      }, {
        text: Lang.get('course.courseName'),
        dataField: 'courseName',
      }, {
        text: Lang.get('course.numberOfCredits'),
        dataField: 'numberOfCredits',
      }, {
        text: Lang.get('class.className'),
        dataField: 'className',
      }, {
        text: Lang.get('term.termName'),
        dataField: 'termName',
      }, {
        text: Lang.get('major.majorName'),
        dataField: 'majorName'
      }, {
        text: Lang.get('subject.subjectName'),
        dataField: 'subjectName'
      }, {
        text: Lang.get('subjectVersion.description'),
        dataField: 'description'
      },
 //    {
 //     text: Lang.get('lecture.lectureName'),
 //     dataField: 'lectureName'
 //    }
      ];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});
