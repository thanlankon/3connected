define.form('component.dialog.manage-account.ResetPassword', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-account',
      action: 'reset-password'
    }
  };

  form.tmpl = 'dialog.manage-account.reset-password';

  form.formType = form.FormType.Dialog.VALIDATION;

  form.initData = function (params) {
    this.data.attr({
      accountId: params.id
    });
  };

  form.submitDialogData = function (entity) {
    var AccountProxy = require('proxy.Account');

    var data = Util.Object.pick(this.data.attr(), ['accountId', 'password']);

    AccountProxy.resetPassword(data, this.proxy(resetPasswordDone));

    function resetPasswordDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      this.hideForm();
    }
  }

  // the validation rules used by form
  form.validateRules = require('validator.rule.Account').resetPassword;
});
