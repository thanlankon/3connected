define.form('component.form.manage-account.ListAccount', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-batch
  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-account'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-account.list-account';

  // the form type is Dialog.LIST
  form.formType = form.FormType.Form.LIST;

  // the proxy that used by the form
  // proxy.findAll & proxy.destroy methods will be used
  form.ServiceProxy = require('proxy.Account');

  // the config used for exporting grid data
  form.exportConfig = require('export.Account');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('account.accountId'),
      dataField: 'accountId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 150,
    }, {
      text: Lang.get('account.username'),
      dataField: 'username',
    }, {
      text: Lang.get('account.role'),
      dataField: 'role',
    }, {
      text: Lang.get('account.userInformationId'),
      dataField: 'userInformationId',
    }, {
      text: Lang.get('account.isActive'),
      dataField: 'isActive',
    }, {
      text: Lang.get('account.expiredDate'),
      dataField: 'expiredDate',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});
