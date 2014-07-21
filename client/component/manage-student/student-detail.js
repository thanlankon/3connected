define.form('component.dialog.manage-student.StudentDetail', function (form, require, Util, Lang) {

  var Role = require('enum.Role');

  if (form.authentication) {
    // admin
    if (Role.isAdministrator(form.authentication.accountRole)) {
      form.urlMap = {
        url: ':module/:action/:id',
        data: {
          module: 'manage-student',
          action: 'detail'
        }
      };
    }

    // staff
    if (Role.isEducator(form.authentication.accountRole)) {
      form.urlMap = {
        url: ':module/:action/:id',
        data: {
          module: 'manage-student',
          action: 'detail'
        }
      };
    }
    // student or parent
    if (Role.isStudentOrParent(form.authentication.accountRole)) {
      form.urlMap = {
        url: ':module',
        data: {
          module: 'profile'
        }
      };

      // init default student Id
      form.initData = function () {
        this.data.attr({
          params: {
            id: this.authentication.userInformationId
          }
        });
      };
    }
  }

  // the template that used by the form
  form.tmpl = 'dialog.manage-student.student-detail';

  // the form type is Dialog.VIEW
  form.formType = form.FormType.Dialog.VIEW;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.Student');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Student');

});
