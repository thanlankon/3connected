/*
 * System          : 3connected
 * Component       : Edit grade category component
 * Creator         : UayLU
 * Created date    : 2014/06/14
 */
define.form('component.dialog.manage-gradeCategory.EditGradeCategory', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-gradeCategory/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-grade-category',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-gradeCategory.edit-gradeCategory';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.GradeCategory');

  // the validation rules used by form
  form.validateRules = require('validator.rule.GradeCategory');

  // init form data
  form.initData = function () {

    var componentSettings = {
      subjectId: {
        ServiceProxy: require('proxy.Subject'),
        combobox: {
          valueMember: 'subjectId',
          displayMember: 'subjectName'
        }
      },
      subjectVersionId: {
        ServiceProxy: require('proxy.SubjectVersion'),
        combobox: {
          valueMember: 'subjectVersionId',
          displayMember: 'description'
        },
        filterByAttributes: ['subjectId']
      }
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

  }

});
