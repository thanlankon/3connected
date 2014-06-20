define.form('component.dialog.manage-course.EditCourse', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-course',
      action: 'edit'
    }
  };

  form.ServiceProxy = require('proxy.Course');

  form.formType = form.FormType.Dialog.EDIT;

  form.tmpl = 'dialog.manage-course.edit-course';

  form.validateRules = require('validator.rule.Course');

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
        }
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

  };

  form.reloadData = function () {

    // set subjectId when reload
    var subjectId = this.data.attr('subjectVersion.subjectId');

    if (this.data.attr('subjectId') != subjectId) {
      this.data.attr({
        subjectId: subjectId
      });
    }

  };

});
