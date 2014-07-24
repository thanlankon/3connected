/*
 * System          : 3connected
 * Component       : Edit class component
 * Creator         : UayLU
 * Created date    : 2014/06/15
 */
define.form('component.dialog.manage-class.EditClass', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-class/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-class',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-class.edit-class';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.Class');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Class');

  // init form data
  form.initData = function () {

    var componentSettings = {
      batchId: {
        ServiceProxy: require('proxy.Batch'),
        combobox: {
          valueMember: 'batchId',
          displayMember: 'batchName'
        }
      },
      majorId: {
        ServiceProxy: require('proxy.Major'),
        combobox: {
          valueMember: 'majorId',
          displayMember: 'majorName'
        }
      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);
  };

});
