
define.form('component.dialog.manage-course.CreateCourse', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-course/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-course',
      action: 'create'
    }
  };

  form.initData = function () {

    var componentSettings = {
      majorId: {
        ServiceProxy: require('proxy.Major'),
        combobox: {
          valueMember: 'majorId',
          displayMember: 'majorName'
        }
      },
      termId: {
        ServiceProxy: require('proxy.Term'),
        combobox: {
          valueMember: 'termId',
          displayMember: 'termName'
        }
      },
      classId: {
        ServiceProxy: require('proxy.Class'),
        combobox: {
          valueMember: 'classId',
          displayMember: 'className'
        }
      },
      subjectId: {
        ServiceProxy: require('proxy.Subject'),
        combobox: {
          valueMember: 'subjectId',
          displayMember: 'subjectName'
        },
        skipDataSubmission: true
      },
      subjectVersionId: {
        ServiceProxy: require('proxy.SubjectVersion'),
        combobox: {
          valueMember: 'subjectVersionId',
          displayMember: 'description'
        },
        filterByAttributes: ['subjectId']
      } //,
      //      lectureId: {
      //        ServiceProxy: require('proxy.Lecture'),
      //        combobox: {
      //          valueMember: 'lectureId',
      //          displayMember: 'lectureName'
      //        }
      //      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);

  }

  // the template that used by the form
  form.tmpl = 'dialog.manage-course.create-course';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.Course');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Course');
});
