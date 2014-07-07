define.form('component.dialog.profile.ChangePassword', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'profile',
      action: 'change-password'
    }
  };

  form.tmpl = 'dialog.profile.change-password';

  form.formType = form.FormType.Dialog.VALIDATION;

  form.initData = function() {
    this.data.attr({
      accountId: this.authentication.accountId
    });
  };

  form.submitDialogData = function(entity) {
    var ProfileProxy = require('proxy.Profile');

    var data = Util.Object.pick(this.data.attr(), ['accountId', 'currentPassword', 'password']);

    ProfileProxy.changePassword(data, this.proxy(changePasswordDone));

    function changePasswordDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      this.hideForm();
    }
  }

  // the validation rules used by form
  form.validateRules = require('validator.rule.Profile').changePassword;
});
